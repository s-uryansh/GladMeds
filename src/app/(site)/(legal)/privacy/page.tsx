import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | GladMeds',
  description: 'Privacy Policy for GladMeds platform',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-body-bg flex justify-center pt-24 px-4">
      <div className="container mx-auto py-14 px-4 max-w-4xl">
        <div className="bg-darkmode rounded-lg shadow-mentor-shadow border border-border p-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-white font-bold text-5xl sm:text-6xl lg:text-7xl">Privacy Policy</h1>
            <p className="text-lightblue">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-lightsky text-4xl sm:text-5xl font-bold">1. Information We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-lightsky">Personal Information</h3>
                <p className="text-lightblue">We collect information you provide directly to us, such as:</p>
                <ul className="list-disc pl-6 space-y-2 text-lightblue">
                  <li>Name and email address when you create an account</li>
                  <li>Profile information you choose to provide</li>
                  <li>Health-related information you input into our platform</li>
                  <li>Communications with our support team</li>
                </ul>

                <h3 className="text-lg font-semibold text-lightsky mt-6">SSO Information</h3>
                <p className="text-lightblue">When you sign up using Single Sign-On (SSO) providers like Google or Facebook, we receive:</p>
                <ul className="list-disc pl-6 space-y-2 text-lightblue">
                  <li>Basic profile information (name, email, profile picture)</li>
                  <li>Information you have made publicly available on those platforms</li>
                  <li>Signing in with SSO means you agree to our Terms and conditions</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lightsky text-4xl sm:text-5xl font-bold">2. How We Use Your Information</h2>
              <p className="text-lightblue">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-lightblue">
                <li>Provide, maintain, and improve our services</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Communicate with you about products, services, and events</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-lightsky text-4xl sm:text-5xl font-bold">3. Information Sharing</h2>
              <p className="text-lightblue">We do not sell, trade, or rent your personal information to third parties. Some of your information is passed to AI so it can give personalized answers.</p>
              <ul className="list-disc pl-6 space-y-2 text-lightblue">
                <li>Information such as:</li>
                <li>Name, Age, Gender, Blood Group</li>
                <li>DOB, Occupation, Languages</li>
                <li>Allergies,Chronic Conditions and other medical summary </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-lightsky text-4xl sm:text-5xl font-bold">4. Data Security</h2>
              <p className="text-lightblue">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. Our security measures include encryption, secure data storage, and regular security audits.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lightsky text-4xl sm:text-5xl font-bold">5. Your Rights</h2>
              <p className="text-lightblue">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-lightblue">
                <li>Access and update your personal information</li>
                {/* <li>Delete your account and personal data</li> */}
                <li>Opt out of certain communications</li>
                <li>Request a copy of your data</li>
                <li>Request correction of inaccurate personal information</li>
                <li>File a complaint with regulatory authorities</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-lightsky text-4xl sm:text-5xl font-bold">6. Data Retention</h2>
              <p className="text-lightblue">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. 
                Health information may be retained for longer periods as required by applicable healthcare regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lightsky text-4xl sm:text-5xl font-bold">7. Contact Us</h2>
              <div className="bg-tablebg p-6 rounded-lg border border-border">
                <p className="text-lightblue mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2 text-lightblue">
                  <p>📧 Email: <span className="text-primary">suryanshrohilwork@gmail.com</span></p>
                  <p>📧 Legal: <span className="text-primary">legal@gladmeds.com</span></p>
                </div>
              </div>
            </section>

            <div className="border-t border-border pt-6">
              <p className="text-lightblue text-center">
                By using our website and services, you agree to the terms outlined in this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}