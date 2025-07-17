import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import GoogleProvider from 'next-auth/providers/google';
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';
import crypto from "crypto";
import { NextAuthOptions, User, Session, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { RowDataPacket } from "mysql2";
import https from 'https';
import bcrypt from 'bcryptjs';
import { sendPasswordEmail } from './nodemailer';

const agent = new https.Agent({
  family: 4, 
});

const db = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
});

function generateRandomPassword(length = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user }: { user: User }) {
      console.log('SignIn callback triggered for user:', user.email);
      if (!user.email) return false;

      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?", 
        [user.email]
      );
      const dbUser = rows[0]; 

      if (!dbUser) {
        console.log('Creating new user for:', user.email);
        const id = crypto.randomUUID();
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        await db.query(
          "INSERT INTO users (id, email, full_name, password_hash, age, gender, terms_accepted, terms_accepted_at, terms_version, created_at) VALUES (?, ?, ?, ?, 25, 'other', true, NOW(), '1.0', NOW())",
          [id, user.email, user.name || 'Google User', hashedPassword]
        );
        
        // Send password email but don't fail if it doesn't work
        try {
          await sendPasswordEmail(user.email, randomPassword, user.name || 'User');
        } catch (error) {
          console.error('Failed to send password email:', error);
        }
        
        (user as any).id = id;
      } else {
        console.log('Existing user found:', user.email);
        (user as any).id = dbUser.id;
      }

      return true;
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user && (user as any).id) {
        token.id = (user as any).id;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback - url:', url, 'baseUrl:', baseUrl);
      
      // If it's a callback URL, redirect to post-login
      if (url.includes('/api/auth/callback')) {
        return `${baseUrl}/api/auth/post-login`;
      }
      
      // If it's already our post-login URL, allow it
      if (url.startsWith(`${baseUrl}/api/auth/post-login`)) {
        return url;
      }
      
      // Default to home page
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export function getUserIdFromToken(req: NextRequest): string | null {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    return decoded.id;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

