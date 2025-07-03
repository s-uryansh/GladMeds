import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | GladMeds',
  description: 'Terms of Service for GladMeds platform',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using GladMeds ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Medical Disclaimer</h2>
            <p>
              <strong>Important:</strong> GladMeds is not a substitute for professional medical advice, diagnosis, or treatment. 
              The information provided through our platform is for educational and informational purposes only. 
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
            <p>
              Never disregard professional medical advice or delay in seeking it because of something you have read on GladMeds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Account and Responsibilities</h2>
            <h3 className="text-lg font-semibold mb-2">Account Creation</h3>
            <p>To use certain features of our service, you must create an account. You may register using:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email and password (simple signup)</li>
              <li>Single Sign-On (SSO) through Google, Facebook, or other supported providers</li>
            </ul>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">User Responsibilities</h3>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Providing accurate, current, and complete information during registration</li>
              <li>Maintaining the security and confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Using the service only for lawful purposes and in accordance with these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our 
              <a href="/privacy" className="text-blue-600 hover:underline"> Privacy Policy</a>, 
              which is incorporated into these terms by reference.
            </p>
            <p>
              By using our service, you consent to the collection and use of your information as outlined in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
            <p>You may not use our service:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading health information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To attempt to gain unauthorized access to our service, servers, or networks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive property of GladMeds and its licensors. 
              The service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>
              In no event shall GladMeds, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
              under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the terms.
            </p>
            <p>
              If you wish to terminate your account, you may simply discontinue using the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these terms at any time. 
              If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p>
              What constitutes a material change will be determined at our sole discretion. 
              By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> legal@gladmeds.com</p>
              <p><strong>Address:</strong> [Your Company Address]</p>
              <p><strong>Phone:</strong> [Your Contact Number]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}