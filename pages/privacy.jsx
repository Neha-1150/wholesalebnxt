import { useEffect } from 'react';
import AppLayout from '../components/app/layouts/AppLayout';
import ReactGA from "react-ga4";

const PrivacyPage = () => {
	useEffect(() => {global.analytics.page('privacy'); ReactGA.send({ hitType: "pageview", page: "/privacy" });},[])
	return (
		<AppLayout>
			<main className="container">
				<div className="text-xs text-darkColor-700 dark:text-darkColor-200">
					<h2 className="text-2xl font-bold">Privacy policy</h2>
					<br />
					<p>
						Shopclients Consultancy Services Private Limited (hereinafter referred to as “BazaarNXT”) is committed to safeguarding its users’ privacy
						(hereinafter referred to as “Your” “You”) accessing its website (i.e. BazaarNXT.com) and has provided this Privacy Policy to familiarize You with
						the manner in which BAZAARNXT collects, uses and discloses Your information collected through the Website.
					</p>
					<br />
					<p>
						Before you subscribe to and/or begin participating in or using website, BAZAARNXT believes that You have fully read, understood and accept the terms
						and conditions of this privacy policy.
					</p>
					<br />
					<p>The Policy applies to all information that BAZAARNXT has about You and Your account.</p>
					<br />
					<p>
						If you do not agree to or wish to be bound by the terms and conditions of this privacy policy, please do not proceed further to use this website.
					</p>
					<br />
					<p>This Policy should be at all times read along with the Terms of Use of the Website.</p>
					<br />
					<p>
						This document is published in accordance with the provisions of Rule 3 (1) of the Information Technology (Intermediaries guidelines) Rules, 2011
						that require publishing the rules and regulations, privacy policy for access or usage of www.BazaarNXT.com website.
					</p>
					<br />

					<h3 className="text-xl font-bold">COLLECTION OF INFORMATION</h3>
					<br />

					<p>
						BAZAARNXT collects information, including sensitive personal data and information (collectively, “Information”), from the users, when they register
						to gain access to the services provided by BAZAARNXT or at other specific instances when BazaarNXT deems it necessary and requests users to provide
						the Information. Information shall include, but not be limited to, the following:
					</p>
					<br />
					<ul>
						<li>NAME OF THE USER</li>
						<li>ADDRESS</li>
						<li>TELEPHONE NUMBER</li>
						<li>E-MAIL ADDRESS</li>
						<li>PASSWORD(S)</li>
						<li>FINANCIAL INFORMATION IN THE NATURE OF BANK ACCOUNT, CREDIT CARD, DEBIT CARD OR</li>
						<li>OTHER PAYMENT INSTRUMENT DETAILS</li>
					</ul>
					<br />
					<p>
						You can always choose not to provide information and in such cases, if the information required is classified as mandatory, You will not be able to
						avail of that part of the Services, features or content. You can add or update Your Personal Information on a regular basis. When You update
						information, BAZAARNXT will keep a copy of the prior version for its records.
					</p>
					<br />
					<p>
						BAZAARNXT's primary goal in collecting information is to provide the user with a customized experience on our websites. This includes personalized
						services, interactive communication and other services. BAZAARNXT collects Your Personal Information in order to record, support and facilitate Your
						participation in the activities You select, track Your preferences, to notify You of any updated information and new activities and other related
						functions offered by BAZAARNXT, keep You informed about latest content available on the Website, special offers, and other products and services of
						BAZAARNXT, to provide You with a customized Website experience, to assist You with customer service or technical support issues, to follow up with
						You after Your visit, to otherwise support Your relationship with BAZAARNXT or to prevent fraud and unlawful use.
					</p>
					<br />
					<p>
						Certain information may be collected when you visit the Website and such information may be stored in server logs in the form of data. Through this
						Data BAZAARNXT understand the use and number of user visiting the Website. Some or all data collected may be shared with the sponsors, investors,
						advertisers, developer, strategic business partners of BAZAARNXT. While using the Website, BAZAARNXT's servers (hosted by a third party service
						provider) may collect information indirectly and automatically about Your activities on the Website; for instance by way of cookies.
					</p>
					<br />
					<p>
						We record buying and browsing activities of our users including but not limited to YOUR contact details and profiles and uses the same to provide
						value-added services to our users.
					</p>
					<br />
					<p>
						We use them to administer the site, track a user's movement and gather broad demographic information for aggregate use. Once a user registers,
						he/she is no longer anonymous to BAZAARNXT and it is deemed that the user has given BAZAARNXT the right to use the personal & non personal
						information.
					</p>
					<br />
					<p>Please note our website is also not a risks proof website.</p>
					<br />
					<h5 className="text-lg font-bold">USE OF INFORMATION</h5>
					<br />
					<p>
						Business information is used to display the user's business listing or product offerings across our website to fetch maximum business opportunities
						for the user. If You upload any content on the Website and the same may be available to the other users of the Website. BAZAARNXT will not be liable
						for the disclosure and dissemination of such content to any third parties. Once the user's content is displayed on our website, the user may start
						receiving business enquiries through email, phone calls, WhatsApp or SMS notifications, from third parties that might or might not be of their
						interest, BAZAARNXT does not exercise any control over it.
					</p>
					<br />
					<p>
						We may also use your Personal Information to contact you via SMS, Email, WhatsApp, or any other messaging service for several reasons including but
						not limited to:
					</p>
					<br />
					<ul className="ml-10 list-disc">
						<li>Send Order confirmation</li>
						<li>Keep you informed of the current order status</li>
						<li>Send any updates or changes for your orders</li>
						<li>Request for product or service reviews</li>
						<li>Send verification message(s)</li>
						<li>Validate/authenticate your account to prevent any misuse or abuse</li>
						<li>Contact you for a special gift or offer</li>
					</ul>
					<br />
					<h5 className="text-lg font-bold">DISCLOSURE</h5>
					<br />
					<p>In situations when BAZAARNXT is legally obligated to disclose information to the government or other third parties, BAZAARNXT will do so.</p>
					<br />
					<h5 className="text-lg font-bold">SHARING OF INFORMATION</h5>
					<br />
					<p>
						As a general rule, BAZAARNXT will not disclose or share any of the user's personally identifiable information except when BAZAARNXT has the user's
						permission or under special circumstances, such as when BAZAARNXT believes in good faith that the law requires it or as permitted in terms of this
						policy.
					</p>
					<br />
					<p>
						You are required to submit Your information at the time of making an online purchase on the Website. BAZAARNXT uses an online payment gateway that
						is operated by a third party and the information that You share with BAZAARNXT is transferred and shared with such third party payment gateway
						operator. The said operator may also have access to Your online purchase history/details that You make from the Website. Extremely sensitive
						information like Your credit-card details are transacted upon secure sites of approved payment gateways which are digitally under encryption,
						thereby providing the highest possible degree of care as per current technology. You are advised, however, that internet technology is not 100% safe
						and You should exercise discretion on using the same.
					</p>
					<br />
					<h5 className="text-lg font-bold">LINKS TO THIRD PARTY SITES</h5>
					<br />
					<p>
						Links to third party sites are provided by website as a convenience to user(s) and BAZAARNXT has not have any control over such sites i.e. content
						and resources provided by them. BAZAARNXT may allow user(s) access to content, products or services offered by third parties through hyper links (in
						the form of word link, banners, channels or otherwise) to such Third Party's web site. You are cautioned to read such sites' terms and conditions
						and/or privacy policies before using such sites in order to be aware of the terms and conditions of your use of such sites. BAZAARNXT believes that
						user(s) acknowledge that BAZAARNXT has no control over such third party's site, does not monitor such sites, and BAZAARNXT shall not be responsible
						or liable to anyone for such third party site, or any content, products or services made available on such a site.
					</p>
					<br />
					<h5 className="text-lg font-bold">PROTECTION OF INFORMATION</h5>
					<br />
					<p>
						BAZAARNXT takes necessary steps, within its limits of commercial viability and necessity, to ensure that the user's information is treated secured
					</p>
					<br />
					<p>
						Unfortunately, no data transmission over the Internet can be guaranteed to be 100% secure. As a result, while BAZAARNXT strives to protect the
						user's personal & business information, it cannot ensure the security of any information transmitted to BAZAARNXT and you do so at your own risk.
						Once BAZAARNXT receives your transmission, it makes best efforts to ensure its security in its systems. Please keep in mind that whenever you post
						personal & business information online, that is accessible to the public, you may receive unsolicited messages from other parties.
					</p>
					<br />
					<p>
						BAZAARNXT is not responsible for any breach of security or for any actions of any third parties that receive Your Information. The Website also
						linked to many other sites and we are not/shall be not responsible for their privacy policies or practices as it is beyond our control.
					</p>
					<br />
					<p>
						Notwithstanding anything contained in this Policy or elsewhere, BAZAARNXT shall not be held responsible for any loss, damage or misuse of Your
						Information, if such loss, damage or misuse is attributable to a Force Majeure Event (as defined in Terms of Use).
					</p>
					<br />
					<h5 className="text-lg font-bold">DISTRIBUTION OF INFORMATION</h5>
					<br />
					<p>
						BAZAARNXT may, from time to time, send its users emails regarding its products and services. BAZAARNXT constantly tries and improves the website for
						better efficiency, more relevancy, innovative business matchmaking and better personal preferences. BAZAARNXT may allow direct mails using its own
						scripts (without disclosing the email address) with respect/pertaining to the products and services of third parties that it feels may be of
						interest to the user or if the user has shown interest in the same.
					</p>
					<br />
					<h5 className="text-lg font-bold">CHANGES IN PRIVACY POLICY</h5>
					<br />
					<p>
						The policy may change from time to time so please check periodically. The revised Policy shall be made available on the Website. Your continued use
						of the Website, following changes to the Policy, will constitute your acceptance of those changes. Any disputes arising under this Policy shall be
						governed by the laws of India.
					</p>
					<br />
					<h5 className="text-lg font-bold">GRIEVANCES</h5>
					<br />
					<p>In case of any grievance regarding use of your Information, please write at:</p>
					<br />
					<p>
						Email: <a href="mailto:contact@bazaarnxt.com">contact@bazaarnxt.com</a>
					</p>
					<br />
					<div>
						Address: <address>Shop No 318/296/6, 1st Floor, 24th Main, 1st Sector, HSR Layout, Bengaluru 560102</address>
					</div>
					<br />
					<p>with all the relevant details of your grievance.</p>
				</div>
			</main>
		</AppLayout>
	);
};

export default PrivacyPage;
