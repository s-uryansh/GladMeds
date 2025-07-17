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
import bcrypt from 'bcrypt';
import { sendPasswordEmail } from '@/lib/nodemailer';

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
      httpOptions: {
        agent,
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user.email) return false;

      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?", 
        [user.email]
      );
      const dbUser = rows[0]; 

      if (!dbUser) {
        const id = crypto.randomUUID();
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        await db.query(
          "INSERT INTO users (id, email, full_name, password_hash, age, created_at) VALUES (?, ?, ?, ?, 0, NOW())",
          [id, user.email, user.name, hashedPassword]
        );
        await sendPasswordEmail(user.email, randomPassword, user.name || 'User');
        
        (user as any).id = id;
      } else {
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
      return `${baseUrl}/api/auth/post-login`;
    },
  },
  pages: {
        // signIn: '/auth/signin',
        error: '/auth/error',
    },
  secret: process.env.NEXTAUTH_SECRET,

}
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
