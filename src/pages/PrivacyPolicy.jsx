import React from 'react';
import './PolicyPages.css';

const PrivacyPolicy = () => {
  return (
    <main className="policy-page">
      <div className="policy-container">

        {/* ── Header ── */}
        <header className="policy-header">
          <span className="policy-last-updated">Last Updated: June 2025</span>
          <h1>Privacy Policy</h1>
          <p className="policy-subtitle">
            Your privacy matters to us. This policy explains how DevToolsHub collects,
            uses, and protects your information.
          </p>
        </header>

        {/* 1. Introduction */}
        <section className="policy-section" aria-labelledby="intro-heading">
          <h2 className="policy-h2" id="intro-heading">1. Introduction</h2>
          <p className="policy-p">
            Welcome to <strong>DevToolsHub</strong> ("we", "our", or "us"). We operate the website
            located at <a href="https://devtoolshub.com">devtoolshub.com</a> (the "Site"), which
            provides free, browser-based developer and productivity tools including an Age Calculator,
            EMI Calculator, Timezone Converter, Password Generator, and Code Formatter &amp; Diff Checker.
          </p>
          <p className="policy-p">
            This Privacy Policy describes how we handle information when you visit our Site. By using
            DevToolsHub, you agree to the practices described in this policy. If you do not agree,
            please discontinue use of the Site.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="policy-section" aria-labelledby="collect-heading">
          <h2 className="policy-h2" id="collect-heading">2. Information We Collect</h2>
          <p className="policy-p">
            We collect minimal information necessary to operate and improve the Site. The categories
            of information we may collect include:
          </p>
          <ul className="policy-ul">
            <li className="policy-li">
              <strong>Usage Data:</strong> Automatically collected data such as your IP address,
              browser type and version, operating system, referring URLs, pages visited, and the
              date and time of your visit. This data is collected via server logs and analytics tools.
            </li>
            <li className="policy-li">
              <strong>Cookies &amp; Tracking Technologies:</strong> Small text files placed on your
              device by us or our advertising partners (see Section 4) to remember preferences and
              serve relevant advertisements.
            </li>
            <li className="policy-li">
              <strong>Tool Inputs:</strong> All calculations and inputs you enter into our tools
              (e.g., dates, loan amounts, code snippets) are processed entirely in your browser.
              We do not transmit, store, or log any tool input data on our servers.
            </li>
            <li className="policy-li">
              <strong>Contact Information:</strong> If you contact us via email, we collect the
              information you voluntarily provide (name, email address, message content).
            </li>
          </ul>
          <p className="policy-p">
            We do <strong>not</strong> require account registration and do not collect passwords,
            payment information, or sensitive personal data.
          </p>
        </section>

        {/* 3. How We Use Information */}
        <section className="policy-section" aria-labelledby="use-heading">
          <h2 className="policy-h2" id="use-heading">3. How We Use Your Information</h2>
          <p className="policy-p">We use the information we collect to:</p>
          <ul className="policy-ul">
            <li className="policy-li">Operate, maintain, and improve the Site and its tools.</li>
            <li className="policy-li">Analyze usage patterns to understand which features are most valuable.</li>
            <li className="policy-li">Display relevant advertisements through Google AdSense (see Section 4).</li>
            <li className="policy-li">Respond to your inquiries and support requests.</li>
            <li className="policy-li">Detect and prevent fraudulent or abusive activity.</li>
            <li className="policy-li">Comply with applicable legal obligations.</li>
          </ul>
          <p className="policy-p">
            We do not sell, rent, or trade your personal information to third parties for their
            own marketing purposes.
          </p>
        </section>

        {/* 4. Cookies & Advertising */}
        <section className="policy-section" aria-labelledby="cookies-heading">
          <h2 className="policy-h2" id="cookies-heading">4. Cookies &amp; Advertising</h2>
          <p className="policy-p">
            We use cookies and similar tracking technologies to enhance your experience and to
            serve advertisements. Cookies are small data files stored on your device.
          </p>
          <p className="policy-p"><strong>Types of cookies we use:</strong></p>
          <ul className="policy-ul">
            <li className="policy-li">
              <strong>Essential Cookies:</strong> Required for the Site to function correctly
              (e.g., theme preference storage).
            </li>
            <li className="policy-li">
              <strong>Analytics Cookies:</strong> Help us understand how visitors interact with
              the Site (e.g., Google Analytics).
            </li>
            <li className="policy-li">
              <strong>Advertising Cookies:</strong> Used by Google AdSense and the DoubleClick
              network to serve personalized ads based on your browsing history and interests.
            </li>
          </ul>
          <p className="policy-p">
            <strong>Google AdSense &amp; DoubleClick:</strong> We use Google AdSense to display
            advertisements on our Site. Google uses the DoubleClick cookie to serve ads based on
            your prior visits to our Site and other websites on the Internet. Google's use of
            advertising cookies enables it and its partners to serve ads based on your visit to
            our Site and/or other sites on the Internet. You may opt out of personalized
            advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>{' '}
            or{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              www.aboutads.info/choices
            </a>.
          </p>
          <p className="policy-p">
            For more information on how Google uses data when you use our Site, please visit{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              How Google uses data when you use our partners' sites or apps
            </a>.
          </p>
        </section>

        {/* 5. Third-Party Advertising */}
        <section className="policy-section" aria-labelledby="thirdparty-heading">
          <h2 className="policy-h2" id="thirdparty-heading">5. Third-Party Advertising</h2>
          <p className="policy-p">
            We partner with third-party advertising companies, including Google, to display ads
            when you visit our Site. These companies may use information about your visits to this
            and other websites (not including your name, address, email address, or phone number)
            to provide advertisements about goods and services of interest to you.
          </p>
          <p className="policy-p">
            Third-party ad servers or ad networks use technologies such as cookies, JavaScript,
            or web beacons in their respective advertisements and links that appear on DevToolsHub.
            These technologies are used to measure the effectiveness of their advertising campaigns
            and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p className="policy-p">
            DevToolsHub has no access to or control over these cookies that are used by third-party
            advertisers. You should consult the respective privacy policies of these third-party
            ad servers for more detailed information on their practices.
          </p>
        </section>

        {/* 6. Your Choices */}
        <section className="policy-section" aria-labelledby="choices-heading">
          <h2 className="policy-h2" id="choices-heading">6. Your Choices</h2>
          <p className="policy-p">You have several options to control your data and privacy:</p>
          <ul className="policy-ul">
            <li className="policy-li">
              <strong>Browser Cookie Controls:</strong> Most browsers allow you to refuse or delete
              cookies through their settings. Note that disabling cookies may affect Site functionality.
            </li>
            <li className="policy-li">
              <strong>Opt Out of Personalized Ads:</strong> Visit{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>{' '}
              to opt out of interest-based advertising from Google.
            </li>
            <li className="policy-li">
              <strong>Network Advertising Initiative:</strong> Visit{' '}
              <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
                NAI Opt-Out
              </a>{' '}
              to opt out of targeted advertising from NAI member companies.
            </li>
            <li className="policy-li">
              <strong>Do Not Track:</strong> Some browsers transmit "Do Not Track" signals. We
              currently do not respond to these signals, but we respect your right to privacy.
            </li>
          </ul>
        </section>

        {/* 7. Data Security */}
        <section className="policy-section" aria-labelledby="security-heading">
          <h2 className="policy-h2" id="security-heading">7. Data Security</h2>
          <p className="policy-p">
            We implement reasonable technical and organizational measures to protect the information
            we collect against unauthorized access, disclosure, alteration, or destruction. Our Site
            is served over HTTPS to encrypt data in transit.
          </p>
          <p className="policy-p">
            Since all tool computations happen entirely in your browser, sensitive inputs such as
            passwords generated by our Password Generator or code entered into our Code Formatter
            are never transmitted to our servers.
          </p>
          <p className="policy-p">
            However, no method of transmission over the Internet or electronic storage is 100%
            secure. We cannot guarantee absolute security and encourage you to use our tools
            responsibly.
          </p>
        </section>

        {/* 8. Children's Privacy (COPPA) */}
        <section className="policy-section" aria-labelledby="children-heading">
          <h2 className="policy-h2" id="children-heading">8. Children's Privacy (COPPA)</h2>
          <p className="policy-p">
            DevToolsHub is not directed to children under the age of 13. We do not knowingly
            collect personally identifiable information from children under 13. In compliance with
            the Children's Online Privacy Protection Act (COPPA), if we become aware that a child
            under 13 has provided us with personal information, we will promptly delete such
            information from our records.
          </p>
          <p className="policy-p">
            If you are a parent or guardian and believe your child has provided us with personal
            information, please contact us at{' '}
            <a href="mailto:contact@devtoolshub.com">contact@devtoolshub.com</a> so we can take
            appropriate action.
          </p>
          <p className="policy-p">
            We have configured our Google AdSense account to not serve personalized ads to users
            who may be under the age of 18 where required by applicable law.
          </p>
        </section>

        {/* 9. Changes to This Policy */}
        <section className="policy-section" aria-labelledby="changes-heading">
          <h2 className="policy-h2" id="changes-heading">9. Changes to This Policy</h2>
          <p className="policy-p">
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, or other factors. When we make changes, we will update
            the "Last Updated" date at the top of this page.
          </p>
          <p className="policy-p">
            We encourage you to review this Privacy Policy periodically to stay informed about how
            we are protecting your information. Your continued use of the Site after any changes
            constitutes your acceptance of the updated policy.
          </p>
        </section>

        {/* 10. Contact Us */}
        <section className="policy-section" aria-labelledby="contact-heading">
          <h2 className="policy-h2" id="contact-heading">10. Contact Us</h2>
          <p className="policy-p">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our
            data practices, please contact us:
          </p>
          <div className="contact-info-row">
            <span className="info-icon">✉️</span>
            <span>
              Email:{' '}
              <a href="mailto:contact@devtoolshub.com">contact@devtoolshub.com</a>
            </span>
          </div>
          <p className="policy-p" style={{ marginTop: '1rem' }}>
            We aim to respond to all privacy-related inquiries within 5 business days.
          </p>
        </section>

      </div>
    </main>
  );
};

export default PrivacyPolicy;
