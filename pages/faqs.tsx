import Link from "next/link";
import AppLayout from "../components/app/layouts/AppLayout";
import { BellIcon } from "@heroicons/react/solid";
import { ReceiptRefundIcon, CameraIcon, CheckCircleIcon, DocumentTextIcon } from "@heroicons/react/outline";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";


const Faqs = () => {
  useEffect(() => {
    global.analytics.page("refund policy");
    ReactGA.send({ hitType: "pageview", page: "/refund-policy" });
  }, []);
  return (
    <AppLayout className={" "} backTitle={" "} barStyle={" "}>
      <div className="w-full h-full p-5">
        <div>
          <h1 className="mb-3 text-xl font-bold">Payment Terms and Conditions </h1>

          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center rounded-lg bg-brand-500 px-4 h-16 text-left text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <div className="flex justify-between w-full">
                    <span>What are our Payment Terms and Conditions ? [English]</span>
                    <ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-white`} />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                  <ol className="flex flex-col my-4 text-sm list-inside gap-y-1">
                    <li className="list-decimal mb-3 gap-x-2">
                      Does BazaarNXT provide credit ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">NO we DO NOT provide any credit </li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                      What are the payment methods accepted at BazaarNXT ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">Advance Online payment</li>
                        <li className="list-disc gap-x-2 ml-3">Cash</li>
                        <li className="list-disc gap-x-2 ml-3">UPI</li>
                        <li className="list-disc gap-x-2 ml-3">NEFT</li>
                        <li className="list-disc gap-x-2 ml-3">RTGS</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                      When should the payment be made ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">Advance while placing order</li>
                        <li className="list-disc gap-x-2 ml-3">On the time of delivery</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                      Can I make advance payments while placing orders ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">YES, you can pay in advance while placing orders online</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                      Do BazaarNXT accept cheques?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">NO we DON'T accept any cheques.</li>
                      </ol>
                    </li>
                  </ol>
                  <p>For any queries reach out to your sales associates- available between morning 10 am to evening 6 pm only</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure as="div" className="mt-4">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center rounded-lg bg-brand-500 px-4 h-16 text-left text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <div className="flex justify-between w-full">
                    <span>भुगतान नियम और शर्तें ? [Hindi]</span>
                    <ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-white`} />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                  <ol className="flex flex-col my-4 text-sm list-inside gap-y-1">
                    <li className="list-decimal mb-3 gap-x-2">
                    क्या BazaarNXT क्रेडिट प्रदान करता है ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">नहीं, हम कोई क्रेडिट प्रदान नहीं करते हैं</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                        BazaarNXT में भुगतान के कौन से तरीके स्वीकार किए जाते हैं ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">अग्रिम ऑनलाइन भुगतान</li>
                        <li className="list-disc gap-x-2 ml-3">नकद</li>
                        <li className="list-disc gap-x-2 ml-3">UPI</li>
                        <li className="list-disc gap-x-2 ml-3">एन.ई.एफ.टी</li>
                        <li className="list-disc gap-x-2 ml-3">आर.टी.जी.एस</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                        भुगतान कब किया जाना चाहिए ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">Ordering देते समय</li>
                        <li className="list-disc gap-x-2 ml-3">Delivery के समय</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                        क्या मैं ऑर्डर देते समय अग्रिम भुगतान कर सकता हूँ ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">हां, आप ऑनलाइन ऑर्डर करते समय अग्रिम भुगतान कर सकते हैं।</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                    क्या BazaarNXT चेक स्वीकार करता है?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">नहीं, हम कोई चेक स्वीकार नहीं करते हैं।</li>
                      </ol>
                    </li>
                  </ol>
                  <p>किसी भी प्रश्न के लिए अपने बिक्री सहयोगी से संपर्क करें - केवल सुबह 10 बजे से शाम 6 बजे के बीच उपलब्ध</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure as="div" className="mt-4">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center rounded-lg bg-brand-500 px-4 h-16 text-left text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <div className="flex justify-between w-full">
                    <span>கட்டண விதிமுறைகள் மற்றும் நிபந்தனைகள் ? [Tamil]</span>
                    <ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-white`} />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                  <ol className="flex flex-col my-4 text-sm list-inside gap-y-1">
                    <li className="list-decimal mb-3 gap-x-2">
                    BazaarNXT கடன் வழங்குகிறதா ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">இல்லை நாங்கள் எந்த கடனையும் வழங்க மாட்டோம்</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                    BazaarNXT இல் ஏற்றுக்கொள்ளப்பட்ட கட்டண முறைகள் யாவை ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">முன்கூட்டியே ஆன்லைன் கட்டணம்</li>
                        <li className="list-disc gap-x-2 ml-3">பணம்</li>
                        <li className="list-disc gap-x-2 ml-3">UPI</li>
                        <li className="list-disc gap-x-2 ml-3">NEFT</li>
                        <li className="list-disc gap-x-2 ml-3">RTGS</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                        கட்டணம் எப்போது செலுத்த வேண்டும் ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">ஆர்டர் செய்யும் போது</li>
                        <li className="list-disc gap-x-2 ml-3">டெலிவரி நேரத்தில்</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                        ஆர்டர் செய்யும் போது நான் முன்கூட்டியே பணம் செலுத்தலாமா ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">ஆம், ஆன்லைனில் ஆர்டர் செய்யும் போது முன்கூட்டியே பணம் செலுத்தலாம்</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                    BazaarNXT காசோலையை ஏற்குமா ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">இல்லை நாங்கள் எந்த காசோலையையும் ஏற்க மாட்டோம்</li>
                      </ol>
                    </li>
                  </ol>
                  <p>ஏதேனும் கேள்விகளுக்கு உங்கள் விற்பனை கூட்டாளரை அணுகவும் அல்லது என்ற எண்ணில் தொடர்பு கொள்ளவும் - காலை 10 மணி முதல் மாலை 6 மணி வரை மட்டுமே கிடைக்கும்</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure as="div" className="mt-4">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center rounded-lg bg-brand-500 px-4 h-16 text-left text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <div className="w-full flex justify-between">
                    <span>ಪಾವತಿ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು ? [Kannada]</span>
                    <ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-white`} />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                  <ol className="flex flex-col my-4 text-sm list-inside gap-y-1">
                    <li className="list-decimal mb-3 gap-x-2">
                    BazaarNXT ಕ್ರೆಡಿಟ್ ನೀಡುತ್ತದೆಯೇ ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">ಇಲ್ಲ ನಾವು ಯಾವುದೇ ಕ್ರೆಡಿಟ್ ಅನ್ನು ಒದಗಿಸುವುದಿಲ್ಲ</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                    BazaarNXT ನಲ್ಲಿ ಯಾವ ಪಾವತಿ ವಿಧಾನಗಳನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">ಮುಂಗಡ ಆನ್‌ಲೈನ್ ಪಾವತಿ</li>
                        <li className="list-disc gap-x-2 ml-3">ನಗದು</li>
                        <li className="list-disc gap-x-2 ml-3">UPI</li>
                        <li className="list-disc gap-x-2 ml-3">NEFT</li>
                        <li className="list-disc gap-x-2 ml-3">ಆರ್‌ಟಿಜಿಎಸ್</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                        ಪಾವತಿಯನ್ನು ಯಾವಾಗ ಮಾಡಬೇಕು ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">ಆರ್ಡರ್ ಮಾಡುವಾಗ ಮುನ್ನಡೆಯಿರಿ</li>
                        <li className="list-disc gap-x-2 ml-3">ವಿತರಣೆಯ ಸಮಯದಲ್ಲಿ</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                        ಆರ್ಡರ್ ಮಾಡುವಾಗ ನಾನು ಮುಂಗಡ ಪಾವತಿಗಳನ್ನು ಮಾಡಬಹುದೇ ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">ಹೌದು, ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಆರ್ಡರ್ ಮಾಡುವಾಗ ನೀವು ಮುಂಚಿತವಾಗಿ ಪಾವತಿಸಬಹುದು</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                        BazaarNXT ಚೆಕ್ ಅನ್ನು ಸ್ವೀಕರಿಸುತ್ತದೆಯೇ ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">ಇಲ್ಲ ನಾವು ಯಾವುದೇ ಚೆಕ್ ಸ್ವೀಕರಿಸುವುದಿಲ್ಲ</li>
                      </ol>
                    </li>
                  </ol>
                  <p>ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಿಮ್ಮ ಮಾರಾಟ ಸಹೋದ್ಯೋಗಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಗೆ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ - ಬೆಳಿಗ್ಗೆ 10 ರಿಂದ ಸಂಜೆ 6 ರವರೆಗೆ ಮಾತ್ರ ಲಭ್ಯವಿದೆ</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure as="div" className="mt-4">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center rounded-lg bg-brand-500 px-4 h-16 text-left text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <div className="flex justify-between w-full">
                    <span>చెల్లింపు నిబంధనలు మరియు షరతులు ? [Telugu]</span>
                    <ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-white`} />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                  <ol className="flex flex-col my-4 text-sm list-inside gap-y-1">
                    <li className="list-decimal mb-3 gap-x-2">
                    BazaarNXT క్రెడిట్‌ని అందిస్తుందా ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">లేదు మేము ఎటువంటి క్రెడిట్‌ను అందించము</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                    BazaarNXTలో ఏ చెల్లింపు పద్ధతులు ఆమోదించబడ్డాయి ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">అడ్వాన్స్ ఆన్‌లైన్ చెల్లింపు</li>
                        <li className="list-disc gap-x-2 ml-3">నగదు</li>
                        <li className="list-disc gap-x-2 ml-3">UPI</li>
                        <li className="list-disc gap-x-2 ml-3">NEFT</li>
                        <li className="list-disc gap-x-2 ml-3">RTGS</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                    చెల్లింపు ఎప్పుడు చేయాలి ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">ఆర్డర్ చేసేటప్పుడు అడ్వాన్స్ చేయండి</li>
                        <li className="list-disc gap-x-2 ml-3">డెలివరీ సమయంలో</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                    ఆర్డర్ చేసేటప్పుడు నేను ముందస్తు చెల్లింపులు చేయవచ్చా ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">అవును , ఆన్‌లైన్‌లో ఆర్డర్ చేస్తున్నప్పుడు మీరు ముందస్తుగా చెల్లించవచ్చు</li>
                      </ol>
                    </li>
                    <li className="list-decimal mb-3 gap-x-2">
                    BazaarNXT చెక్‌ని అంగీకరిస్తుందా ?
                      <ol className="flex mt-1 flex-col text-sm list-inside gap-y-1">
                        <li className="list-disc gap-x-2 ml-3">లేదు మేము ఏ చెక్కును అంగీకరించము.</li>
                      </ol>
                    </li>
                  </ol>
                  <p>ఏవైనా సందేహాల కోసం మీ సేల్స్ అసోసియేట్‌ను సంప్రదించండి లేదా నంబర్‌కు మమ్మల్ని సంప్రదించండి - ఉదయం 10 నుండి సాయంత్రం 6 గంటల వరకు మాత్రమే అందుబాటులో ఉంటుంది</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </AppLayout>
  );
};

export default Faqs;
