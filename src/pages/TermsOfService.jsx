import React from 'react';
import './PolicyPages.css';

const TermsOfService = () => {
  return (
    <main className="policy-page">
      <div className="policy-container">

        {/* ── Header ── */}
        <header className="policy-header">
          <span className="policy-last-updated">Last Updated: June 2025</span>
          <h1>Terms of Service</h1>
          <p className="policy-subtitle">
            Please read these terms carefully before using DevToolsHub. By accessing our Site,
            you agree to be bound by these terms.
          </p>
        </header>

        {/* 1. Acceptance of Terms */}
        <section className="policy-section" aria-labelledby="acceptance-heading">
          <h2 className="policy-h2" id="acceptance-heading">1. Acceptance of Terms</h2>
          <p className="policy-p">
            By accessing or using <strong>DevToolsHub</strong> ("Site", "we", "our", or "us"),
            you agree to be bound by these Terms of Service ("Terms") and our{' '}
            <a href="/privacy-policy">Privacy Policy</a>, which is incorporated herein by reference.
            If you do not agree to these Terms, you must not use the Site.
          </p>
          <p className="policy-p">
            We reserve the right to modify these Terms at any time. Changes become effective
            immediately upon posting. Your continued use of the Site after any modification
            constitutes your acceptance of the revised Terms. We encourage you to review these
            Terms periodically.
          </p>
          <p className="policy-p">
            These Terms apply to all visitors, users, and others who access or use the Site.
          </p>
        </section>

        {/* 2. Use of Service */}
        <section className="policy-section" aria-labelledby="use-heading">
          <h2 className="policy-h2" id="use-heading">2. Use of Service</h2>
          <p className="policy-p">
            DevToolsHub provides free, browser-based tools for personal and professional use.
            You agree to use the Site only for lawful purposes and in a manner that does not
            infringe the rights of others or restrict their use and enjoyment of the Site.
          </p>
          <p className="policy-p">You agree <strong>not</strong> to:</p>
          <ul className="policy-ul">
            <li className="policy-li">
              Use the Site in any way that violates applicable local, national, or international
              laws or regulations.
            </li>
            <li className="policy-li">
              Attempt to gain unauthorized access to any part of the Site, its servers, or any
              connected systems.
            </li>
            <li className="policy-li">
              Use automated scripts, bots, scrapers, or other tools to access the Site in a
              manner that places excessive load on our infrastructure.
            </li>
            <li className="policy-li">
              Transmit any unsolicited or unauthorized advertising or promotional material
              (spam) through the Site.
            </li>
            <li className="policy-li">
              Attempt to interfere with, disrupt, or disable any features of the Site.
            </li>
            <li className="policy-li">
              Impersonate any person or entity or misrepresent your affiliation with any person
              or entity.
            </li>
          </ul>
          <p className="policy-p">
            We reserve the right to terminate or restrict your access to the Site at our sole
            discretion, without notice, for conduct that we believe violates these Terms or is
            harmful to other users, us, or third parties.
          </p>
        </section>

        {/* 3. Intellectual Property */}
        <section className="policy-section" aria-labelledby="ip-heading">
          <h2 className="policy-h2" id="ip-heading">3. Intellectual Property</h2>
          <p className="policy-p">
            The Site and its original content, features, and functionality — including but not
            limited to text, graphics, logos, icons, images, and software — are and will remain
            the exclusive property of DevToolsHub and its licensors. They are protected by
            copyright, trademark, and other intellectual property laws.
          </p>
          <p className="policy-p">
            You are granted a limited, non-exclusive, non-transferable, revocable license to
            access and use the Site for your personal, non-commercial purposes. This license
            does not include the right to:
          </p>
          <ul className="policy-ul">
            <li className="policy-li">
              Reproduce, distribute, or publicly display any content from the Site without
              our prior written consent.
            </li>
            <li className="policy-li">
              Modify, create derivative works from, or reverse-engineer any part of the Site.
            </li>
            <li className="policy-li">
              Use any data mining, robots, or similar data gathering and extraction tools on
              the Site.
            </li>
            <li className="policy-li">
              Frame or mirror any part of the Site without our express written consent.
            </li>
          </ul>
          <p className="policy-p">
            Any feedback, suggestions, or ideas you provide regarding the Site may be used by
            us without any obligation to compensate you.
          </p>
        </section>

        {/* 4. Disclaimer of Warranties */}
        <section className="policy-section" aria-labelledby="disclaimer-heading">
          <h2 className="policy-h2" id="disclaimer-heading">4. Disclaimer of Warranties</h2>
          <p className="policy-p">
            THE SITE AND ALL TOOLS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT
            ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
            IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
          <p className="policy-p">
            We do not warrant that:
          </p>
          <ul className="policy-ul">
            <li className="policy-li">
              The Site will be uninterrupted, timely, secure, or error-free.
            </li>
            <li className="policy-li">
              The results obtained from using the tools will be accurate, complete, or reliable.
            </li>
            <li className="policy-li">
              Any errors in the Site will be corrected.
            </li>
          </ul>
          <p className="policy-p">
            The tools provided on DevToolsHub (including the EMI Calculator, Age Calculator,
            and others) are intended for informational and convenience purposes only. Results
            should not be relied upon as professional financial, legal, medical, or other
            professional advice. Always consult a qualified professional for important decisions.
          </p>
        </section>

        {/* 5. Limitation of Liability */}
        <section className="policy-section" aria-labelledby="liability-heading">
          <h2 className="policy-h2" id="liability-heading">5. Limitation of Liability</h2>
          <p className="policy-p">
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, DEVTOOLSHUB AND ITS OWNERS,
            EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF
            PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN
            CONNECTION WITH:
          </p>
          <ul className="policy-ul">
            <li className="policy-li">Your access to or use of (or inability to access or use) the Site.</li>
            <li className="policy-li">Any conduct or content of any third party on the Site.</li>
            <li className="policy-li">Any content obtained from the Site.</li>
            <li className="policy-li">
              Unauthorized access, use, or alteration of your transmissions or content.
            </li>
          </ul>
          <p className="policy-p">
            In no event shall our total liability to you for all claims arising out of or
            relating to these Terms or your use of the Site exceed the amount you paid us in
            the twelve (12) months preceding the claim (which, given our free service, is $0).
          </p>
        </section>

        {/* 6. Third-Party Links */}
        <section className="policy-section" aria-labelledby="links-heading">
          <h2 className="policy-h2" id="links-heading">6. Third-Party Links</h2>
          <p className="policy-p">
            The Site may contain links to third-party websites or services that are not owned
            or controlled by DevToolsHub. We have no control over, and assume no responsibility
            for, the content, privacy policies, or practices of any third-party websites.
          </p>
          <p className="policy-p">
            We strongly advise you to read the terms and privacy policy of any third-party
            website you visit. The inclusion of any link does not imply our endorsement of the
            linked site.
          </p>
        </section>

        {/* 7. Advertising */}
        <section className="policy-section" aria-labelledby="advertising-heading">
          <h2 className="policy-h2" id="advertising-heading">7. Advertising</h2>
          <p className="policy-p">
            DevToolsHub is supported by advertising revenue. We display advertisements served
            by Google AdSense and other third-party advertising networks. By using the Site,
            you acknowledge and agree that:
          </p>
          <ul className="policy-ul">
            <li className="policy-li">
              Advertisements may be displayed on any page of the Site.
            </li>
            <li className="policy-li">
              The nature, frequency, and placement of advertisements are determined by us and
              our advertising partners.
            </li>
            <li className="policy-li">
              We are not responsible for the content of third-party advertisements or the
              products/services they promote.
            </li>
            <li className="policy-li">
              Clicking on advertisements may direct you to third-party websites governed by
              their own terms and privacy policies.
            </li>
          </ul>
          <p className="policy-p">
            We comply with Google AdSense program policies and do not engage in invalid click
            activity or any practice that violates Google's advertising policies.
          </p>
        </section>

        {/* 8. Governing Law */}
        <section className="policy-section" aria-labelledby="law-heading">
          <h2 className="policy-h2" id="law-heading">8. Governing Law</h2>
          <p className="policy-p">
            These Terms shall be governed by and construed in accordance with applicable laws,
            without regard to conflict of law provisions. Any disputes arising under or in
            connection with these Terms shall be subject to the exclusive jurisdiction of the
            competent courts.
          </p>
          <p className="policy-p">
            If any provision of these Terms is found to be unenforceable or invalid, that
            provision will be limited or eliminated to the minimum extent necessary so that
            these Terms will otherwise remain in full force and effect.
          </p>
          <p className="policy-p">
            Our failure to enforce any right or provision of these Terms will not be considered
            a waiver of those rights.
          </p>
        </section>

        {/* 9. Contact */}
        <section className="policy-section" aria-labelledby="contact-heading">
          <h2 className="policy-h2" id="contact-heading">9. Contact Us</h2>
          <p className="policy-p">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="contact-info-row">
            <span className="info-icon">✉️</span>
            <span>
              Email:{' '}
              <a href="mailto:contact@devtoolshub.com">contact@devtoolshub.com</a>
            </span>
          </div>
          <p className="policy-p" style={{ marginTop: '1rem' }}>
            We will make every effort to resolve any concerns promptly and fairly.
          </p>
        </section>

      </div>
    </main>
  );
};

export default TermsOfService;
