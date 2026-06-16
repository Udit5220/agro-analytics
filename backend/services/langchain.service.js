import { Chroma } from '@langchain/community/vectorstores/chroma';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Ensure Gemini key is present
const geminiApiKey = process.env.GEMINI_API_KEY;

// Using Gemini for embeddings and chat model
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: geminiApiKey,
  model: 'gemini-embedding-2',
});

export const chatModel = new ChatGoogleGenerativeAI({
  apiKey: geminiApiKey,
  model: 'gemini-flash-latest',
  temperature: 0.2,
  maxRetries: 0, // Fail fast on 429 rate limits instead of hanging for 10+ seconds
});

export const getVectorStore = async (collectionName = 'agro_research_docs') => {
  try {
    return new Chroma(embeddings, {
      collectionName,
      url: process.env.CHROMA_URL || 'http://localhost:8000',
    });
  } catch (error) {
    console.error('Error connecting to ChromaDB:', error);
    throw new Error('Vector database connection failed.');
  }
};

export const indexDocument = async (text, metadata = {}, collectionName = 'agro_research_docs') => {
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const docs = await textSplitter.createDocuments([text], [metadata]);
    
    const vectorStore = await getVectorStore(collectionName);
    await vectorStore.addDocuments(docs);
    return true;
  } catch (error) {
    console.error('Error indexing document:', error);
    throw error;
  }
};

export const queryVectorStore = async (query, collectionName = 'agro_research_docs') => {
  try {
    const vectorStore = await getVectorStore(collectionName);
    
    const retriever = vectorStore.asRetriever({ k: 5 });
    
    // Aggressive timeout to prevent long hangs if ChromaDB is offline
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('ChromaDB query timeout')), 2000));
    const docs = await Promise.race([retriever.invoke(query), timeoutPromise]);
    const contextText = docs.map(d => d.pageContent).join("\n\n");
    
    const promptText = `
      You are an expert agricultural scientist and advisor.
      Use the following pieces of retrieved context to answer the question. 
      You MUST strictly base your answer ONLY on the provided context. If the context does not contain the answer, explicitly state that you do not have enough information.
      Do not hallucinate or extrapolate beyond the provided data.
      
      Context: ${contextText}
      
      Question: ${query}
      
      Answer in detailed markdown format, prioritizing actionable insights for agriculture based purely on the context.
    `;

    const res = await chatModel.invoke(promptText);
    
    return {
      answer: res.content,
      sourceDocuments: docs
    };
  } catch (error) {
    console.error('Error querying vector store:', error);
    throw error;
  }
};

const completionCache = new Map();

export const generateCompletion = async (promptText, role = null) => {
    try {
        let finalPrompt = promptText;
        if (role) {
            // Need to dynamically import to avoid circular dependency issues if any
            const { default: PromptTemplateModel } = await import('../models/PromptTemplate.js');
            const template = await PromptTemplateModel.findOne({ role });
            if (template) {
                finalPrompt = `System Instruction: ${template.systemInstruction}\nSafety Rules: ${template.safetyRules || ''}\n\nUser Prompt:\n${promptText}`;
            }
        }
        
        // Cache to drastically reduce load times for identical prompts
        const cacheKey = crypto.createHash('md5').update(finalPrompt).digest('hex');
        if (completionCache.has(cacheKey)) {
            return completionCache.get(cacheKey);
        }

        const res = await chatModel.invoke(finalPrompt);
        
        completionCache.set(cacheKey, res.content);
        return res.content;
    } catch (error) {
        console.error('Error generating AI translation:', error);
        throw new Error('Failed to generate translation.');
    }
};

/**
 * Translate mock data structure dynamically or using local fallback mapping for translation safety.
 */
export const translateMockData = async (data, language) => {
    if (language !== 'Hindi') return data;
    
    try {
        const prompt = `You are a professional agricultural translator. Translate the following JSON object representing agricultural news dashboard data from English into Hindi.
        CRITICAL RULES:
        1. Translate all user-facing string values (such as titles, headlines, summaries, metrics, and actionable steps).
        2. Keep all the JSON keys exactly in English.
        3. Do not alter any numerical values, currencies, or formats.
        4. Return ONLY valid JSON, no markdown code blocks.
        
        JSON to translate:
        ${JSON.stringify(data)}`;
        
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Translation timeout')), 8000));
        const res = await Promise.race([chatModel.invoke(prompt), timeoutPromise]);
        
        let content = res.content.trim();
        if (content.startsWith('```json')) content = content.slice(7);
        if (content.endsWith('```')) content = content.slice(0, -3);
        
        return JSON.parse(content);
    } catch (err) {
        console.warn("Gemini dynamic translation of mock data failed, using local dictionary mapping:", err.message);
        
        const localDict = {
            // General Headers & Keys
            "Primary Volume Metrics": "प्राथमिक मात्रा मेट्रिक्स",
            "Historical Trend Analysis": "ऐतिहासिक प्रवृत्ति विश्लेषण",
            "Live Intelligence Feed": "लाइव इंटेलिजेंस फीड",
            "Q1": "तिमाही 1",
            "Q2": "तिमाही 2",
            "Q3": "तिमाही 3",
            "Q4": "तिमाही 4",
            "Wk 1": "सप्ताह 1",
            "Wk 2": "सप्ताह 2",
            "Wk 3": "सप्ताह 3",
            "Wk 4": "सप्ताह 4",
            "Wk 5": "सप्ताह 5",
            "Arrival Vol": "आवक मात्रा",
            "Modal": "मॉडल मूल्य",
            "Trend": "रुझान",
            "Sell 40% immediately": "तुरंत 40% बेचें",
            "Hold rest for 1 week": "शेष 1 सप्ताह के लिए रोकें",
            "AgroSense Real-time Intelligence Feed": "एग्रोसेंस रीयल-टाइम इंटेलिजेंस फीड",
            "PRICE": "कीमत",
            "ALERT": "अलर्ट",
            "TREND": "रुझान",
            "MSP": "एमएसपी",
            "WEATHER": "मौसम",
            "CRITICAL": "महत्वपूर्ण",
            "TECH": "तकनीक",
            "SUBSIDY": "सब्सिडी",
            "UPDATE": "अपडेट",
            "CREDIT": "ऋण",
            "KCC": "केसीसी",
            "SCHEME": "योजना",
            
            // Crops
            "Wheat": "गेहूं",
            "Rice": "धान",
            "Soybean": "सोयाबीन",
            "Cotton": "कपास",
            "Mustard": "सरसों",
            "Maize": "मक्का",
            "Sugarcane": "गन्ना",
            "Onion": "प्याज़",
            "Tomato": "टमाटर",
            "Potato": "आलू",
            
            // Regions
            "Punjab": "पंजाब",
            "Haryana": "हरियाणा",
            "Maharashtra": "महाराष्ट्र",
            "Madhya Pradesh": "मध्य प्रदेश",
            "UP": "उत्तर प्रदेश",
            "Gujarat": "गुजरात",
            "Karnataka": "कर्नाटक",
            "Telangana": "तेलंगाना",
            
            // Common abbreviations & acronyms
            "FPO": "एफपीओ",
            "FPOs": "एफपीओ",
            "NABARD": "नाबार्ड",
            "Nabard": "नाबार्ड",
            "RBI": "आरबीआई",
            "PM-Kisan": "पीएम-किसान",
            "PMFBY": "पीएमएफबीवाई",
            "DBT": "डीबीटी",
            "e-NAM": "ई-नाम",
            "WAF": "वेब एप्लिकेशन फ़ायरवॉल",
            "EBITDA": "ईबिटडा",
            "SKU": "एसकेयू",
            "M&A": "विलय और अधिग्रहण",
            "LTL": "एलटीएल",
            "2FA": "द्वि-कारक प्रमाणीकरण",
            "Node C": "नोड सी",
            "qtl": "क्विंटल",
            "qtl.": "क्विंटल",
            "per quintal": "प्रति क्विंटल",
            "per quintal.": "प्रति क्विंटल है।",
            "/qtl": " / क्विंटल",
            "/qtl.": " / क्विंटल",
            "in": "में",
            "at": "पर",
            "Heatwave": "लू की लहर",
            "Pest infestation": "कीट प्रकोप",
            "Supply chain glut": "आपूर्ति श्रृंखला की अधिकता",
            "FCI": "एफसीआई",
            "PDS": "पीडीएस",
            "IMD": "आईएमडी",
            "B2B": "बी2बी",
            "A+": "ए+",
            
            // General segment translations to translate all other templates
            "arrivals surge in": "की आवक",
            "Mandis, modal price drops by": "मंडियों में बढ़ी, मूल्य में गिरावट आई",
            "Traders anticipate a bullish trend for": "व्यापारी उम्मीद करते हैं एक तेजी का रुझान",
            "following strong export demand.": "मजबूत निर्यात मांग के बाद।",
            "Local mandi in": "स्थानीय मंडी",
            "introduces e-NAM digital auctioning to improve transparency.": "पारदर्शिता में सुधार के लिए ई-नाम डिजिटल नीलामी शुरू करती है।",
            "procurement by state agencies begins at MSP of": "की राज्य एजेंसियों द्वारा खरीद न्यूनतम समर्थन मूल्य (MSP) पर शुरू होती है जो",
            "IMD issues orange alert for heavy rainfall in": "आईएमडी ने भारी बारिश के लिए ऑरेंज अलर्ट जारी किया",
            "over the next 48 hours.": "में अगले 48 घंटों में।",
            "Extended dry spell threatens": "लंबे समय तक सूखा खतरे में डालता है",
            "yields in central": "की पैदावार को मध्य",
            "Hailstorm damages early sown": "ओलावृष्टि से जल्दी बोई गई",
            "in northern districts.": "को उत्तरी जिलों में नुकसान पहुंचा।",
            "Optimal weather conditions forecast for upcoming": "आगामी",
            "sowing season.": "बुवाई के मौसम के लिए अनुकूल मौसम का अनुमान।",
            "New AI-driven soil testing kits distributed to farmers in": "नए एआई-संचालित मृदा परीक्षण किट वितरित किए गए किसानों को",
            "Subsidy announced for purchasing agricultural drones for precision spraying.": "सटीक छिड़काव के लिए कृषि ड्रोन खरीदने के लिए सब्सिडी की घोषणा की गई।",
            "Mobile app launched for real-time crop disease diagnosis using smartphone cameras.": "स्मार्टफोन कैमरों का उपयोग करके वास्तविक समय में फसल रोग निदान के लिए मोबाइल ऐप लॉन्च किया गया।",
            "Adoption of solar water pumps increases by 20% due to favorable state policies.": "अनुकूल राज्य नीतियों के कारण सौर जल पंपों को अपनाने में 20% की वृद्धि हुई।",
            "RBI extends interest subvention scheme on short-term crop loans.": "आरबीआई ने अल्पकालिक फसल ऋण पर ब्याज सहायता योजना का विस्तार किया।",
            "Kisan Credit Card (KCC) limit increased for farmers cultivating": "किसानों के लिए किसान क्रेडिट कार्ड (केसीसी) की सीमा बढ़ाई गई खेती करने वाले",
            "State cooperative banks announce loan restructuring for drought-affected areas.": "राज्य सहकारी बैंकों ने सूखा प्रभावित क्षेत्रों के लिए ऋण पुनर्गठन की घोषणा की।",
            "Digital lending platforms offer micro-credit with 24-hour approval.": "डिजिटल लेंडिंग प्लेटफॉर्म 24 घंटे की मंजूरी के साथ माइक्रो-क्रेडिट प्रदान करते हैं।",
            "PM-Kisan 15th installment released; 8 crore farmers benefit.": "पीएम-किसान की 15वीं किस्त जारी; 8 करोड़ किसानों को लाभ।",
            "New crop insurance premium rates announced under PMFBY for": "पीएमएफबीवाई के तहत फसल बीमा प्रीमियम की नई दरें घोषित की गईं",
            "State government launches direct benefit transfer (DBT) for fertilizer purchase.": "राज्य सरकार ने उर्वरक खरीद के लिए प्रत्यक्ष लाभ हस्तांतरण (DBT) शुरू किया।",
            "Deadline extended for e-KYC verification to receive scheme benefits.": "योजना के लाभ प्राप्त करने के लिए ई-केवाईसी सत्यापन की समय सीमा बढ़ाई गई।",
            
            // FPO Templates
            "Cluster audit reveals 92% compliance among participating FPOs in": "क्लस्टर ऑडिट से पता चलता है कि भाग लेने वाले एफपीओ में 92% अनुपालन है",
            "Risk assessment highlights potential vulnerability due to": "जोखिम मूल्यांकन में संभावित भेद्यता पर प्रकाश डाला गया है जिसके कारण",
            "FPO network expands with 15 new registered societies this quarter.": "इस तिमाही में 15 नई पंजीकृत समितियों के साथ एफपीओ नेटवर्क का विस्तार हुआ।",
            "Quarterly performance review shows a 12% increase in collective bargaining power.": "तिमाही प्रदर्शन समीक्षा सामूहिक सौदेबाजी की शक्ति में 12% की वृद्धि दिखाती है।",
            "Bulk buyers seeking forward contracts for": "थोक खरीदार अग्रिम अनुबंध मांग रहे हैं",
            "at a premium.": "प्रीमियम पर।",
            "B2B demand for organic produce surges in urban centers.": "शहरी केंद्रों में जैविक उत्पादों की बी2बी मांग बढ़ी।",
            "New institutional buyer partners with": "नया संस्थागत खरीदार साझेदारी करता है",
            "FPO for direct procurement.": "एफपीओ के साथ सीधे खरीद के लिए।",
            "Market sentiment remains positive despite minor fluctuations in commodity index.": "कमोडिटी इंडेक्स में मामूली उतार-चढ़ाव के बावजूद बाजार की धारणा सकारात्मक बनी हुई है।",
            "Bulk urea allocation approved for": "थोक यूरिया आवंटन को मंजूरी दी गई",
            "FPOs ahead of Rabi season.": "एफपीओ के लिए रबी सीजन से पहले।",
            "Seed procurement costs negotiated down by 8% through collective buying.": "सामूहिक खरीद के माध्यम से बीज खरीद लागत में 8% की कमी की गई।",
            "Supply chain disruptions cause temporary delays in agro-chemical deliveries.": "आपूर्ति श्रृंखला व्यवधानों के कारण कृषि-रासायनिक डिलीवरी में अस्थायी देरी हुई।",
            "New organic fertilizer supplier onboarded with favorable terms.": "अनुकूल शर्तों के साथ नया जैविक उर्वरक आपूर्तिकर्ता ऑनबोर्ड किया गया।",
            "Cold storage capacity expanded in": "शीत भंडारण क्षमता का विस्तार किया गया",
            "to handle perishable": "खराब होने वाले उत्पादों को संभालने के लिए",
            "Freight rates stabilize following recent fluctuations in fuel prices.": "ईंधन की कीमतों में हाल के उतार-चढ़ाव के बाद माल ढुलाई दरें स्थिर हुईं।",
            "FPO consortium invests in shared transport fleet to reduce transit costs.": "एफपीओ कंसोर्टियम पारगमन लागत को कम करने के लिए साझा परिवहन बेड़े में निवेश करता है।",
            "Logistics optimization software deployment reduces delivery times by 15%.": "लॉजिस्टिक्स अनुकूलन सॉफ्टवेयर परिनियोजन से डिलीवरी समय में 15% की कमी आती है।",
            "Nabard announces new grant pool for FPO infrastructure development.": "नाबार्ड ने एफपीओ बुनियादी ढांचे के विकास के लिए नए अनुदान पूल की घोषणा की।",
            "Compliance deadline approaching for annual financial audits.": "वार्षिक वित्तीय ऑडिट के लिए अनुपालन की समय सीमा निकट आ रही है।",
            "State government introduces tax incentives for FPOs engaged in food processing.": "राज्य सरकार ने खाद्य प्रसंस्करण में लगे एफपीओ के लिए कर प्रोत्साहन की शुरुआत की।",
            "Training program launched on legal compliance and corporate governance.": "कानूनी अनुपालन और कॉर्पोरेट प्रशासन पर प्रशिक्षण कार्यक्रम शुरू किया गया।",
            
            // Trader Templates
            "Global commodity index rises on the back of tightening": "तंग होने के कारण वैश्विक कमोडिटी सूचकांक बढ़ा",
            "supplies.": "की आपूर्ति।",
            "Macroeconomic trends indicate a shift towards essential agricultural commodities.": "मैक्रोइकॉनॉमिक रुझान आवश्यक कृषि वस्तुओं की ओर बदलाव का संकेत देते हैं।",
            "Forex volatility impacts import costs for agricultural inputs.": "फॉरेक्स अस्थिरता कृषि आदानों की आयात लागत को प्रभावित करती है।",
            "International futures markets show strong support levels for": "अंतरराष्ट्रीय वायदा बाजार मजबूत समर्थन स्तर दिखाते हैं",
            "Significant price spread observed between": "के बीच महत्वपूर्ण मूल्य अंतर देखा गया",
            "and neighboring state mandis for": "और पड़ोसी राज्य की मंडियों के बीच",
            "Arbitrage opportunities emerge due to localized oversupply of": "स्थानीयकृत अति आपूर्ति के कारण आर्बिट्राज के अवसर पैदा होते हैं",
            "Transport costs offset potential gains in short-term arbitrage trades.": "परिवहन लागत अल्पकालिक आर्बिट्राज ट्रेडों में संभावित लाभ की भरपाई करती है।",
            "Traders capitalize on price discrepancies during peak arrival season.": "व्यापारी आगमन के चरम सीजन के दौरान मूल्य विसंगतियों का लाभ उठाते हैं।",
            "El Nino forecasts raise concerns over": "एल नीनो के पूर्वानुमानों से चिंताएं बढ़ गई हैं",
            "yields in key producing regions.": "की प्रमुख उत्पादक क्षेत्रों में पैदावार पर।",
            "Pest outbreaks reported in": "कीटों के प्रकोप की सूचना मिली है",
            "threatening to reduce marketable surplus.": "जिससे बिक्री योग्य अधिशेष कम होने का खतरा है।",
            "Stock-to-use ratios decline, signaling potential supply tightness.": "स्टॉक-टू-यूज़ अनुपात घटता है, जो संभावित आपूर्ति तंग होने का संकेत देता है।",
            "Early assessments indicate a 10% drop in": "प्रारंभिक आकलन से पता चलता है कि 10% की गिरावट आई है",
            "production due to erratic weather.": "के उत्पादन में अनियमित मौसम के कारण।",
            "Government imposes 20% export duty on": "सरकार ने 20% निर्यात शुल्क लगाया",
            "to curb domestic inflation.": "घरेलू मुद्रास्फीति को नियंत्रित करने के लिए।",
            "Export quotas released for the upcoming quarter.": "आगामी तिमाही के लिए निर्यात कोटा जारी किया गया।",
            "Changes in phytosanitary requirements affect": "पादप स्वच्छता आवश्यकताओं में बदलाव प्रभावित करते हैं",
            "exports to European markets.": "यूरोपीय बाजारों में निर्यात को।",
            "Bilateral trade agreement opens new markets for value-added agricultural products.": "द्विपक्षीय व्यापार समझौता मूल्य वर्धित कृषि उत्पादों के लिए नए बाजार खोलता है।",
            "FCI accelerates": "एफसीआई तेजी लाता है",
            "procurement in": "खरीद में",
            "to meet buffer stock targets.": "बफर स्टॉक लक्ष्यों को पूरा करने के लिए।",
            "Private institutional buying outpaces government procurement in early season.": "सीजन की शुरुआत में निजी संस्थागत खरीद सरकारी खरीद से आगे निकल जाती।",
            "Warehousing constraints slow down the pace of institutional flows.": "भंडारण की बाधाएं संस्थागत प्रवाह की गति को धीमा करती हैं।",
            "State agencies announce a bonus over MSP to encourage farmer participation.": "राज्य एजेंसियां किसान भागीदारी को बढ़ावा देने के लिए एमएसपी पर बोनस की घोषणा करती हैं।",
            
            // Procurement Manager Templates
            "Supply network analysis shows 98% fulfillment rate across all active nodes.": "आपूर्ति नेटवर्क विश्लेषण सभी सक्रिय नोड्स में 98% पूर्ति दर दिखाता है।",
            "Optimization required for Node C due to recurring delivery delays.": "बार-बार होने वाली डिलीवरी देरी के कारण नोड सी के लिए अनुकूलन की आवश्यकता है।",
            "Integration of new vendors improves overall supply chain resilience.": "नए विक्रेताओं का एकीकरण समग्र आपूर्ति श्रृंखला लचीलेपन में सुधार करता है।",
            "Quarterly review indicates a 5% reduction in procurement cycle time.": "तिमाही समीक्षा खरीद चक्र समय में 5% की कमी का संकेत देती है।",
            "Sourcing risk elevated in": "सोर्सिंग जोखिम बढ़ गया है",
            "due to ongoing transport strikes.": "चल रही परिवहन हड़तालों के कारण।",
            "Vendor default rates remain low, indicating stable supply partnerships.": "विक्रेता डिफ़ॉल्ट दरें कम बनी हुई हैं, जो स्थिर आपूर्ति साझेदारी का संकेत देती हैं।",
            "Diversification strategy successfully mitigates impact of localized crop failures.": "विविधीकरण रणनीति स्थानीयकृत फसल विफलताओं के प्रभाव को सफलतापूर्वक कम करती है।",
            "Quality concerns from key suppliers trigger heightened inspection protocols.": "प्रमुख आपूर्तिकर्ताओं से गुणवत्ता संबंधी चिंताएं बढ़ी हुई निरीक्षण प्रोटोकॉल को ट्रिगर करती हैं।",
            "Successful negotiations lead to volume discounts for bulk": "सफल वार्ता से थोक के लिए वॉल्यूम छूट मिलती है",
            "purchases.": "की खरीद पर।",
            "Leveraging long-term contracts to stabilize procurement prices.": "खरीद कीमतों को स्थिर करने के लिए दीर्घकालिक अनुबंधों का लाभ उठाना।",
            "Vendors push back on extended payment terms citing liquidity constraints.": "विक्रेता तरलता बाधाओं का हवाला देते हुए विस्तारित भुगतान शर्तों का विरोध करते हैं।",
            "Strategic partnerships formed with key FPOs to ensure consistent supply.": "लगातार आपूर्ति सुनिश्चित करने के लिए प्रमुख एफपीओ के साथ रणनीतिक साझेदारी बनाई गई।",
            "Introduction of AI-based assaying reduces rejection rates by 1.4%.": "एआई-आधारित परख की शुरुआत से अस्वीकृति दर में 1.4% की कमी आती है।",
            "Moisture levels in incoming": "आने वाले बैचों में नमी का स्तर",
            "batches from": "जो",
            "exceed acceptable limits.": "से हैं, स्वीकार्य सीमा से अधिक हैं।",
            "Strict adherence to grading standards improves overall product quality.": "ग्रेडिंग मानकों का कड़ा पालन समग्र उत्पाद गुणवत्ता में सुधार करता है।",
            "New testing protocols implemented for detecting pesticide residues.": "कीटनाशक अवशेषों का पता लगाने के लिए नए परीक्षण प्रोटोकॉल लागू किए गए।",
            "Route optimization software implementation reduces idle time and fuel consumption.": "रूट ऑप्टिमाइज़ेशन सॉफ़्टवेयर कार्यान्वयन निष्क्रिय समय और ईंधन की खपत को कम करता है।",
            "LTL shipments consolidated to improve logistics efficiency.": "लॉजिस्टिक्स दक्षता में सुधार के लिए एलटीएल शिपमेंट को समेकित किया गया।",
            "Fleet availability impacted by seasonal demand spikes.": "बेड़े की उपलब्धता मौसमी मांग में वृद्धि से प्रभावित हुई।",
            "Alternative routing strategies deployed to bypass highway construction zones.": "राजमार्ग निर्माण क्षेत्रों को बायपास करने के लिए वैकल्पिक रूटिंग रणनीतियाँ तैनात की गईं।",
            
            // Agribusiness Manager Templates
            "Corporate macro trends indicate a shift towards sustainable agriculture investments.": "कॉर्पोरेट मैक्रो रुझान टिकाऊ कृषि निवेशों की ओर बदलाव का संकेत देते हैं।",
            "Q2 financial results show steady revenue growth and improved EBITDA margins.": "दूसरी तिमाही के वित्तीय परिणाम स्थिर राजस्व वृद्धि और बेहतर ईबिटडा मार्जिन दिखाते हैं।",
            "Market share increases by 2% following successful product launch in": "सफल उत्पाद लॉन्च के बाद बाजार हिस्सेदारी में 2% की वृद्धि हुई",
            "Review of operating expenses highlights areas for potential cost savings.": "परिचालन व्यय की समीक्षा संभावित लागत बचत के क्षेत्रों पर प्रकाश डालती है।",
            "Competitor launches aggressive promotional campaign for new hybrid": "प्रतिस्पर्धी ने नए हाइब्रिड के लिए आक्रामक प्रचार अभियान शुरू किया",
            "seeds.": "के बीजों के लिए।",
            "Market analysis reveals a shift in competitor pricing strategies.": "बाजार विश्लेषण से प्रतिस्पर्धी मूल्य निर्धारण रणनीतियों में बदलाव का पता चलता है।",
            "Intelligence reports indicate potential M&A activity among key rivals.": "खुफिया रिपोर्टें प्रमुख प्रतिद्वंद्वियों के बीच संभावित विलय और अधिग्रहण गतिविधि का संकेत देती हैं।",
            "New SKU introductions by competitors threaten market share in the premium segment.": "प्रतिद्वंद्वियों द्वारा नए एसकेयू की शुरुआत प्रीमियम सेगमेंट में बाजार हिस्सेदारी के लिए खतरा है।",
            "Supply chain optimization efforts lead to a 10% reduction in holding costs.": "आपूर्ति श्रृंखला अनुकूलन प्रयासों से होल्डिंग लागत में 10% की कमी आती है।",
            "Implementation of Just-In-Time (JIT) inventory management improves cash flow.": "जस्त-इन-टाइम इन्वेंट्री प्रबंधन का कार्यान्वयन कैश फ्लो में सुधार करता है।",
            "Lead times for imported agricultural inputs increase due to global shipping delays.": "वैश्विक शिपिंग देरी के कारण आयातित कृषि आदानों का लीड समय बढ़ जाता है।",
            "Renegotiation of warehousing contracts yields significant cost savings.": "भंडारण अनुबंधों की पुनर्नगोशिएशन से महत्वपूर्ण लागत बचत होती है।",
            "Consumer demand for organic and traceably sourced products continues to rise.": "जैविक और ट्रेस करने योग्य स्रोतों से प्राप्त उत्पादों के लिए उपभोक्ता मांग लगातार बढ़ रही है।",
            "Retail point-of-sale data shows a 5% increase in store footfall.": "रिटेल पॉइंट-ऑफ-सेल डेटा स्टोर फुटफॉल में 5% की वृद्धि दिखाता है।",
            "Premium product bundles perform exceptionally well during the festive season.": "त्योहारों के मौसम में प्रीमियम उत्पाद बंडल असाधारण रूप से अच्छा प्रदर्शन करते हैं।",
            "Shift in consumer preferences necessitates adjustments to product portfolio.": "उपभोक्ता प्राथमिकताओं में बदलाव के कारण उत्पाद पोर्टफोलियो में समायोजन आवश्यक है।",
            "Due diligence process nears completion for the acquisition of a regional ag-tech startup.": "एक क्षेत्रीय एग-टेक स्टार्टअप के अधिग्रहण के लिए उचित परिश्रम प्रक्रिया पूरी होने के करीब है।",
            "Strategic merger expected to yield significant synergies in supply chain operations.": "रणनीतिक विलय से आपूर्ति श्रृंखला संचालन में महत्वपूर्ण तालमेल की उम्मीद है।",
            "Target company valuation finalized, term sheet presented to the board.": "लक्षित कंपनी का मूल्यांकन अंतिम रूप दिया गया, टर्म शीट बोर्ड के समक्ष प्रस्तुत की गई।",
            "Exploratory talks initiated with potential partners in the food processing sector.": "खाद्य प्रसंस्करण क्षेत्र में संभावित भागीदारों के साथ खोजपूर्ण बातचीत शुरू की गई।",
            
            // Research Analyst Templates
            "New agronomy paper published on the efficacy of bio-stimulants in": "में जैव-उत्तेजक की प्रभावकारिता पर नया कृषि विज्ञान पेपर प्रकाशित हुआ",
            "cultivation.": "की खेती में।",
            "Peer-reviewed study highlights the long-term benefits of regenerative agriculture practices.": "सहकर्मी-समीक्षित अध्ययन सुरक्षात्मक कृषि प्रथाओं के दीर्घकालिक लाभों पर प्रकाश डालता है।",
            "Research findings presented at the international conference on agricultural sustainability.": "कृषि स्थिरता पर अंतर्राष्ट्रीय सम्मेलन में अनुसंधान निष्कर्ष प्रस्तुत किए गए।",
            "Meta-analysis of field data confirms the superior yield potential of new hybrid varieties.": "क्षेत्रीय डेटा का मेटा-विश्लेषण नए हाइब्रिड किस्मों की बेहतर उपज क्षमता की पुष्टि करता है।",
            "Climate models predict a 15% probability of severe drought in central": "जलवायु मॉडल मध्य में गंभीर सूखे की 15% संभावना की भविष्यवाणी करते हैं",
            "Long-term forecasting indicates a shift in rainfall patterns affecting traditional sowing windows.": "दीर्घकालिक पूर्वानुमान पारंपरिक बुवाई खिड़कियों को प्रभावित करने वाले वर्षा पैटर्न में बदलाव का संकेत देता है।",
            "Integration of satellite imagery improves the accuracy of localized climate impact models.": "उपग्रह इमेजरी का एकीकरण स्थानीयकृत जलवायु प्रभाव मॉडल की सटीकता में सुधार करता है।",
            "Simulations highlight the vulnerability of": "सिमुलेशन संवेदनशीलता पर प्रकाश डालते हैं",
            "production to rising average temperatures.": "के उत्पादन की बढ़ते औसत तापमान के प्रति।",
            "Phase 2 trials of drought-resistant": "सूखा प्रतिरोधी के चरण 2 के परीक्षण",
            "varieties show promising results.": "की किस्मों ने आशाजनक परिणाम दिखाए हैं।",
            "CRISPR gene-editing techniques successfully utilized to enhance disease resistance.": "रोग प्रतिरोधक क्षमता बढ़ाने के लिए क्रिस्पर जीन-एडिटिंग तकनीकों का सफलतापूर्वक उपयोग किया गया।",
            "New bio-fortified crop varieties developed to address nutritional deficiencies.": "पोषण संबंधी कमियों को दूर करने के लिए नई बायो-फोर्टिफाइड फसल किस्में विकसित की गईं।",
            "Regulatory approval sought for the commercial release of genetically modified traits.": "आनुवंशिक रूप से संशोधित लक्षणों की व्यावसायिक रिलीज के लिए नियामक अनुमोदन मांगा गया।",
            "Study reveals a strong correlation between soil microbial diversity and crop resilience.": "अध्ययन से मिट्टी की सूक्ष्मजीव विविधता और फसल लचीलेपन के बीच एक मजबूत संबंध का पता चलता है।",
            "Application of specific bio-fertilizers significantly improves soil organic carbon levels.": "विशिष्ट जैव-उर्वरकों के अनुप्रयोग से मिट्टी के कार्बनिक कार्बन स्तर में महत्वपूर्ण सुधार होता है।",
            "Research focuses on optimizing the soil microbiome to enhance nutrient uptake.": "अनुसंधान पोषक तत्वों के अवशोषण को बढ़ाने के लिए मिट्टी के माइक्रोबायोम को अनुकूलित करने पर केंद्रित है।",
            "Comprehensive soil health index developed based on biological indicators.": "जैविक संकेतकों के आधार पर व्यापक मृदा स्वास्थ्य सूचकांक विकसित किया गया।",
            "Economic analysis of the recent fertilizer subsidy reveals a positive impact on crop yields.": "हाल के उर्वरक सब्सिडी के आर्थिक विश्लेषण से फसल की पैदावार पर सकारात्मक प्रभाव का पता चलता है।",
            "Policy brief highlights the need for targeted interventions to support smallholder farmers.": "नीति संक्षिप्त विवरण छोटे किसानों के समर्थन के लिए लक्षित हस्तक्षेपों की आवश्यकता पर प्रकाश डालता है।",
            "Assessment of the MSP framework suggests reforms to better align with market dynamics.": "एमएसपी ढांचे का आकलन बाजार की गतिशीलता के साथ बेहतर तालमेल बनाने के लिए सुधारों का सुझाव देता है।",
            "Study evaluates the fiscal cost of state-level agricultural debt waiver programs.": "अध्ययन राज्य-स्तरीय कृषि ऋण माफी कार्यक्रमों की राजकोषीय लागत का मूल्यांकन करता है।",
            
            // Government Official Templates
            "District crisis monitor activated in response to reports of severe": "गंभीर की रिपोर्टों के जवाब में जिला संकट मॉनिटर सक्रिय किया गया",
            "in": "जो",
            "Rapid response teams deployed to assess crop damage following unseasonal rainfall.": "बेमौसम बारिश के बाद फसल के नुकसान का आकलन करने के लिए त्वरित प्रतिक्रिया टीमें तैनात की गईं।",
            "Inter-departmental coordination established to ensure timely supply of essential inputs.": "आवश्यक इनपुट की समय पर आपूर्ति सुनिश्चित करने के लिए अंतर-विभागीय समन्वय स्थापित किया गया।",
            "Real-time monitoring dashboard tracks the status of critical agricultural infrastructure.": "वास्तविक समय की निगरानी डैशबोर्ड महत्वपूर्ण कृषि बुनियादी ढांचे की स्थिति को ट्रैक करता है।",
            "Phase 1 of disaster relief funds disbursed directly to affected farmers' bank accounts.": "आपदा राहत कोष का चरण 1 सीधे प्रभावित किसानों के बैंक खातों में वितरित किया गया।",
            "Audit of the DBT system confirms a 98% success rate in targeted fund delivery.": "DBT प्रणाली का ऑडिट लक्षित फंड वितरण में 98% सफलता दर की पुष्टि करता है।",
            "Grievance redressal mechanism established to address failed transactions and discrepancies.": "विफल लेनदेन और विसंगतियों को दूर करने के लिए शिकायत निवारण तंत्र स्थापित किया गया।",
            "State government approves an additional relief package for severely impacted districts.": "राज्य सरकार ने गंभीर रूप से प्रभावित जिलों के लिए एक अतिरिक्त राहत पैकेज को मंजूरी दी।",
            "Public sentiment analysis indicates general approval of the new procurement policy.": "सार्वजनिक भावना विश्लेषण नई खरीद नीति की सामान्य स्वीकृति का संकेत देता है।",
            "Concerns raised by farmer unions regarding the availability of subsidized fertilizers.": "किसान यूनियनों द्वारा रियायती उर्वरकों की उपलब्धता के संबंध में चिंताएं उठाई गईं।",
            "Awareness campaigns launched to educate farmers about the benefits of crop insurance.": "किसानों को फसल बीमा के लाभों के बारे में शिक्षित करने के लिए जागरूकता अभियान शुरू किए गए।",
            "Feedback mechanism implemented to capture grassroots sentiment on agricultural initiatives.": "कृषि पहलों पर जमीनी भावना को पकड़ने के लिए फीडबैक तंत्र लागू किया गया।",
            "FCI buffer stocks deemed sufficient to meet PDS requirements for the current fiscal year.": "एफसीआई बफर स्टॉक वर्तमान वित्तीय वर्ष के लिए पीडीएस आवश्यकताओं को पूरा करने के लिए पर्याप्त समझा गया।",
            "Audits of storage silos identify areas for improving preservation techniques and reducing wastage.": "भंडारण सिलोस के ऑडिट संरक्षण तकनीकों में सुधार और बर्बादी को कम करने के क्षेत्रों की पहचान करते हैं।",
            "Strategic allocations of food grains approved to stabilize open market prices.": "खुले बाजार की कीमतों को स्थिर करने के लिए खाद्यान्नों के रणनीतिक आवंटन को मंजूरी दी गई।",
            "Long-term food security strategy emphasizes crop diversification and climate resilience.": "दीर्घकालिक खाद्य सुरक्षा रणनीति फसल विविधीकरण और जलवायु लचीलेपन पर जोर देती है।",
            "Construction of new godowns fast-tracked to expand scientific storage capacity.": "वैज्ञानिक भंडारण क्षमता का विस्तार करने के लिए नए गोदामों के निर्माण को तेजी से आगे बढ़ाया गया।",
            "Irrigation coverage extended by 4% under the latest state-sponsored scheme.": "नवीनतम राज्य-प्रायोजित योजना के तहत सिंचाई कवरेज में 4% का विस्तार किया गया।",
            "Capital expenditure utilization for agricultural infrastructure projects reaches 75%.": "कृषि बुनियादी ढांचा परियोजनाओं के लिए पूंजीगत व्यय का उपयोग 75% तक पहुंच गया है।",
            "Inspections of newly established cold chain facilities confirm adherence to quality standards.": "नव स्थापित कोल्ड चेन सुविधाओं का निरीक्षण गुणवत्ता मानकों के अनुपालन की पुष्टि करता है।",
            
            // Company Admin Templates
            "Data ingestion engine operating at optimal capacity with an uptime of 99.99%.": "डेटा अंतर्ग्रहण इंजन 99.99% के अपटाइम के साथ इष्टतम क्षमता पर काम कर रहा है।",
            "System alerts triggered by a temporary spike in data processing latency.": "डेटा प्रोसेसिंग विलंबता में अस्थायी स्पाइक द्वारा सिस्टम अलर्ट ट्रिगर किया गया।",
            "Scaling up ingestion workers to handle increased volume from new data sources.": "नए डेटा स्रोतों से बढ़ी हुई मात्रा को संभालने के लिए अंतर्ग्रहण कार्यकर्ताओं को बढ़ाना।",
            "Dead-letter queue cleared following resolution of API parsing errors.": "API पार्सिंग त्रुटियों के समाधान के बाद डेड-लेटर कतार को साफ किया गया।",
            "All critical API endpoints and active webhooks reporting 100% health.": "सभी महत्वपूर्ण API एंडपॉइंट और सक्रिय वेबहुक 100% स्वास्थ्य की रिपोर्ट कर रहे हैं।",
            "Routine rotation of API keys completed without service interruption.": "बिना किसी सेवा रुकावट के API कुंजियों का नियमित रोटेशन पूरा हुआ।",
            "Bandwidth utilization analysis helps identify opportunities for payload compression.": "बैंडविड्थ उपयोग विश्लेषण पेलोड संपीड़न के अवसरों की पहचान करने में मदद करता है।",
            "Rate limiting policies adjusted to accommodate peak usage times.": "पीक उपयोग के समय को समायोजित करने के लिए दर सीमित करने की नीतियों को समायोजित किया गया।",
            "Active user base surpasses 1.2 million, with steady daily signups.": "सक्रिय उपयोगकर्ता आधार 1.2 मिलियन से अधिक हो गया है, जिसमें स्थिर दैनिक साइनअप हैं।",
            "Security audit of administrator roles and access permissions initiated.": "प्रशासक भूमिकाओं और पहुंच अनुमतियों का सुरक्षा ऑडिट शुरू किया गया।",
            "Mandatory two-factor authentication (2FA) enforcement rolled out for all privileged accounts.": "सभी विशेषाधिकार प्राप्त खातों के लिए अनिवार्य दो-कारक प्रमाणीकरण लागू किया गया।",
            "System successfully blocks multiple failed login attempts, preventing unauthorized access.": "सिस्टम अनधिकृत पहुंच को रोकते हुए, कई विफल लॉगिन प्रयासों को सफलतापूर्वक ब्लॉक करता है।",
            "Web Application Firewall (WAF) successfully blocks 1.4k malicious requests.": "वेब एप्लिकेशन फ़ायरवॉल सफलतापूर्वक 1.4 हजार दुर्भावनापूर्ण अनुरोधों को ब्लॉक करता है।",
            "Recent penetration testing reveals zero high-severity vulnerabilities.": "हाल के प्रवेश परीक्षण से शून्य उच्च-गंभीरता भेद्यता का पता चलता है।",
            "Minor dependency patches applied to ensure ongoing system security.": "चल रही सिस्टम सुरक्षा सुनिश्चित करने के लिए छोटे निर्भरता पैच लागू किए गए।",
            "Comprehensive security audit completed, resulting in an A+ score.": "व्यापक सुरक्षा ऑडिट पूरा हुआ, जिसके परिणामस्वरूप ए+ स्कोर मिला।"
        };
        
        const translateValue = (val) => {
            if (typeof val === 'string') {
                if (localDict[val]) return localDict[val];
                let translated = val;
                
                // Sort keys by length descending to replace longer patterns/phrases before shorter sub-parts
                const sortedKeys = Object.keys(localDict).sort((a, b) => b.length - a.length);
                
                sortedKeys.forEach(key => {
                    // Match whole words for short alphanumeric words (length <= 15) to prevent replacing substrings inside other words
                    if (/^[a-zA-Z0-9\s]+$/.test(key) && key.length <= 15) {
                        const regex = new RegExp('\\b' + key + '\\b', 'g');
                        translated = translated.replace(regex, localDict[key]);
                    } else {
                        translated = translated.replaceAll(key, localDict[key]);
                    }
                });
                return translated;
            } else if (Array.isArray(val)) {
                return val.map(translateValue);
            } else if (val !== null && typeof val === 'object') {
                const copy = {};
                Object.keys(val).forEach(k => {
                    copy[k] = translateValue(val[k]);
                });
                return copy;
            }
            return val;
        };
        
        return translateValue(data);
    }
};

const getCropsForState = (stateName) => {
    const cropsMap = {
        "Andhra Pradesh": "Paddy, Maize, Cotton, Chillies, Groundnut",
        "Arunachal Pradesh": "Paddy, Maize, Millet, Ginger, Mustard",
        "Assam": "Tea, Paddy, Jute, Mustard, Sugarcane",
        "Bihar": "Paddy, Wheat, Maize, Potato, Sugarcane",
        "Chhattisgarh": "Paddy, Maize, Soyabean, Groundnut, Pulses",
        "Goa": "Paddy, Cashewnut, Coconut, Arecanut",
        "Gujarat": "Cotton, Groundnut, Castor Seeds, Cumin, Mustard",
        "Haryana": "Wheat, Mustard, Paddy, Cotton, Sugarcane",
        "Himachal Pradesh": "Apples, Maize, Potato, Barley, Wheat",
        "Jharkhand": "Paddy, Maize, Pulses, Mustard, Vegetables",
        "Karnataka": "Coffee, Paddy, Maize, Ragi, Coconut, Cotton",
        "Kerala": "Rubber, Coconut, Black Pepper, Cardamom, Tea",
        "Madhya Pradesh": "Soyabean, Wheat, Gram, Mustard, Cotton",
        "Maharashtra": "Cotton, Sugarcane, Soyabean, Onion, Tur",
        "Manipur": "Paddy, Maize, Pineapple, Mustard",
        "Meghalaya": "Paddy, Maize, Ginger, Turmeric, Potato",
        "Mizoram": "Paddy, Maize, Ginger, Turmeric, Mustard",
        "Nagaland": "Paddy, Maize, Millet, Mustard",
        "Odisha": "Paddy, Groundnut, Jute, Turmeric, Sugarcane",
        "Punjab": "Wheat, Paddy, Cotton, Maize, Potato",
        "Rajasthan": "Mustard, Bajra, Guar Seed, Gram, Wheat",
        "Sikkim": "Cardamom, Ginger, Orange, Paddy",
        "Tamil Nadu": "Paddy, Sugarcane, Groundnut, Coconut, Turmeric",
        "Telangana": "Paddy, Cotton, Maize, Turmeric, Groundnut",
        "Tripura": "Paddy, Rubber, Pineapple, Jackfruit",
        "Uttar Pradesh": "Sugarcane, Wheat, Paddy, Potato, Mustard",
        "Uttarakhand": "Paddy, Ragi, Sugarcane, Apples, Wheat",
        "West Bengal": "Paddy, Jute, Potato, Tea, Rapeseed"
    };
    return cropsMap[stateName] || "Paddy, Wheat, Maize, Vegetables";
};

/**
 * Synthesize raw web news into a strict JSON payload matching the UI schema for a specific role.
 */
const getTopicFocusForCity = (cityName) => {
    const topics = [
        "local infrastructure, transportation bottlenecks, and truck freight rates affecting regional mandi deliveries",
        "recent pest infestation alerts, locust warning advisories, and pesticide availability in local cooperative outlets",
        "innovative warehouse storage methods, local cold storage utilization rates, and cooperative grain bank setups",
        "water levels in local canals, reservoir capacities, rainfall deficit advisories, and farm electricity supply timetables",
        "local commercial bank crop credit distribution campaigns and cooperative society micro-credit interest rate changes",
        "minimum support price state procurement center counters setup and digital e-NAM auction adoption scales",
        "subsidy launches on seeds and organic bio-fertilizer distribution drives organized by local agricultural officers"
    ];
    if (!cityName || cityName === 'India') {
        return "national agricultural policies, federal export-import decisions, and macro crop production forecasts";
    }
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
        hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % topics.length;
    return topics[idx];
};

/**
 * Dynamically determines detailed agricultural characteristics for a given city and state.
 */
const getCityCropAndMandiDetails = (cityName, stateName) => {
    if (!cityName || cityName === 'India') {
        return {
            localMandi: "National Level Markets",
            primaryLocalCrop: "General Agriculture",
            secondaryLocalCrop: "Grain Crops",
            localInfraIssue: "National highway freight transport corridors",
            localWeather: "National weather trends",
            priceOffset: 0,
            localRiskLevel: "Medium",
            seed: 0
        };
    }

    // Generate a deterministic seed based on city name
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
        hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    // List of local mandi names
    const mandiNames = [
        `${cityName} Grain Mandi`,
        `${cityName} Cooperative Krishi Mandi`,
        `New Mandi Yard at ${cityName}`,
        `${cityName} APMC Yard`,
        `Central Mandi of ${cityName}`
    ];
    const localMandi = mandiNames[seed % mandiNames.length];

    // Local specific crops
    const stateCropsList = getCropsForState(stateName).split(',').map(c => c.trim());
    const primaryLocalCrop = stateCropsList[seed % stateCropsList.length] || "Wheat";
    const secondaryLocalCrop = stateCropsList[(seed + 1) % stateCropsList.length] || "Rice";

    // Local infra challenges
    const infraIssues = [
        `congested entry gates at the ${localMandi} causing truck queueing`,
        `lack of covered storage structures at ${localMandi} during sudden unseasonal showers`,
        `limited digital weighing scales in ${localMandi} leading to manual audit delays`,
        `high freight rates on rural link roads connecting nearby villages to ${cityName}`,
        `inadequate cold storage facility capacity for perishable goods near ${cityName}`
    ];
    const localInfraIssue = infraIssues[seed % infraIssues.length];

    // Local weather deviations
    const weatherDeviations = [
        `localized ground moisture levels are at ${50 + (seed % 20)}% which is optimal for the sowing season`,
        `humidity level rises to ${70 + (seed % 15)}% triggering early pest warning advisories`,
        `localized rain forecast of ${5 + (seed % 15)}mm in the next 48 hours for the ${cityName} district`,
        `average temperature is ${2 + (seed % 5)}°C above normal, accelerating crop maturation`,
        `dry wind gusts of ${15 + (seed % 15)} km/h causing soil moisture depletion in farming blocks`
    ];
    const localWeather = weatherDeviations[seed % weatherDeviations.length];

    // Local price offset (to make price generation unique)
    const priceOffset = (seed % 30) * 10 - 150; // -150 to +140
    
    // Sourcing risk level
    const riskLevels = ["High", "Medium", "Low"];
    const localRiskLevel = riskLevels[seed % riskLevels.length];

    return {
        localMandi,
        primaryLocalCrop,
        secondaryLocalCrop,
        localInfraIssue,
        localWeather,
        priceOffset,
        localRiskLevel,
        seed
    };
};

export const synthesizeRoleNews = async (rawNewsContext, role, subPath = '', context = {}, language = 'English') => {
    let expectedFormat = '';
    const userLoc = context.userLoc || 'India';
    const parts = userLoc.split(',').map(p => p.trim());
    const userCity = parts.length > 1 ? parts[0] : '';
    const userState = parts.length > 1 ? parts[1] : parts[0];
    const localCrops = getCropsForState(userState);
    const cityFocus = getTopicFocusForCity(userCity || userState);
    const cityDetails = getCityCropAndMandiDetails(userCity, userState);

    let systemInstruction = `You are an expert agricultural news editor and data synthesizer. 
    You are creating a highly relevant, localized news feed and data analysis for the user role: "${role}" who is located in "${userLoc}".
    
    The major crops grown in the state of "${userState}" (and relevant to "${userLoc}") are: ${localCrops}. 
    For this specific location, the current news and data points must focus heavily on: "${cityFocus}".
    
    CRITICAL LOCALIZATION REQUIREMENT:
    The news, data points, mandi prices, and charts MUST be specific and relevant to the selected location: "${userLoc}", focus on local crops: ${localCrops}, and prioritize stories and insights regarding: "${cityFocus}".
    
    To ensure high specificity and distinctiveness for "${userCity}" (state of "${userState}"), you MUST base the news feed, mandi prices, metrics, and charts on these specific local characteristics:
    - Primary Local Crop to Highlight: ${cityDetails.primaryLocalCrop} (e.g., focus on arrivals, volumes, or conditions of this crop)
    - Secondary Crop: ${cityDetails.secondaryLocalCrop}
    - Specific Mandi name to use in news titles/details: ${cityDetails.localMandi}
    - Local Infrastructure Issue: ${cityDetails.localInfraIssue} (e.g., news about transportation or cold storage bottlenecks should mention this specific issue)
    - Micro-climate weather condition: ${cityDetails.localWeather}
    - Local Sourcing Risk Level: ${cityDetails.localRiskLevel}
    - Numerical Offset: ${cityDetails.priceOffset} (Ensure prices and values are custom to this offset; e.g. base prices for ${cityDetails.primaryLocalCrop} should be shifted by ${cityDetails.priceOffset} INR relative to standard prices, so different cities show different prices).
    
    - If the raw live news contains info for "${userLoc}", synthesize it.
    - If the raw live news does NOT contain specific info for "${userLoc}" (or is empty), you MUST use your own deep agricultural knowledge to dynamically generate and simulate highly realistic, geographically appropriate news, local mandi prices, crop arrivals, weather challenges, and logistics trends specifically for "${userLoc}".
    - Do NOT simply summarize the raw live news if it is about a different region or generic national news. You MUST explicitly adapt, customize, and localize every story, number, and metric to be specific to "${userLoc}" using the city details provided above (e.g. substitute names of states/cities with "${userCity}" and "${userState}", and adjust the pricing/volume data accordingly).
    - The names of local markets, mandis, districts, or landmarks in the headlines and details must match "${userLoc}" (e.g. if the location is "Faridabad, Haryana", use "Faridabad Mandi", "Haryana state agencies", etc. if the location is "Ludhiana, Punjab", use "Ludhiana Mandi", etc.).
    - Ensure that different cities/states receive distinct, realistic news summaries and pricing data (e.g., Ludhiana, Punjab should have wheat-centric mandi arrivals, while Surat, Gujarat might have cotton or groundnut trends; even within the same state, different cities like Gurgaon and Faridabad should have completely distinct stories, prices, local demand indices, or arrival volumes to reflect their local dynamics).`;
    
    const commonSchema = `
        {
          "accordionItems": [
            {
              "ticker_type": "ALERT | TREND | INFESTATION | SUBSIDY | PRICE | MSP | DISBURSEMENT | SYS_OK | CRITICAL",
              "single_line_summary": "string (Strictly brief, max 14 words)",
              "expanded_data_points": {
                "primary_metrics": { "metric1": "string", "metric2": "string", "metric3": "string" },
                "actionable_steps": ["string", "string"],
                "source_or_authority": "string"
              }
            }
          ],
          "page_charts": [
            {
              "title": "string (e.g., 'Arrival Trends')",
              "type": "bar | line",
              "data": [
                { "label": "string", "value": "number" }
              ]
            }
          ]
        }`;

    if (role === 'Procurement Manager') {
        expectedFormat = `
        {
          "disruptions": [ { "location": "string", "issue": "string", "delay": "string" } ],
          "sourcingRisk": [ { "region": "string", "crop": "string", "riskLevel": "High|Medium|Low", "quality": "string" } ]
        }`;
    } else {
        // All other roles use the unified ATS Accordion + Page Chart Gallery architecture
        systemInstruction += `\nSummarize the primary insight using a maximum of 14 words for the initial view title, then break technical insights into exactly 3 explicit key-value strings for the expansion drawer.`;
        systemInstruction += `\nGenerate exactly 1 or 2 highly relevant and appropriate analytical graphs and charts in 'page_charts' tailored specifically for the user role "${role}" and the subpage/topic "${subPath}". For example:
        - For Farmer (e.g. Mandi Insights, Weather & Safety, Agri-tech, Financial & Credit, Scheme News): Mandi Price Trends, Arrival Volume, Soil Moisture levels, Sowing progress, Subsidy disbursements.
        - For FPO (e.g. B2B Market, Input Procurement, Logistics, Compliance & Grants): Bulk Order Trends, Warehousing Utilization, Transport Costs, Member growth.
        - For Commodity Trader (e.g. Mandi Arbitrage, Supply Risk, Export Policy, Institutional Flow): Price Spreads across Mandis, Export Shipments volume, Supply shortage trends.
        - For Procurement Manager (e.g. Sourcing Risk, Vendor Negotiations, Quality Assaying, Logistics Routing): Supply Disruption Index, Vendor Lead Times, Sourcing Price index, Quality grade distribution.
        - For Agribusiness Manager (e.g. Competitor Intel, Supply Chain, Retail Demand, M&A): Market Share, Competitor Price Index, Inventory Turnover, Retail purchase volume.
        - For Research Analyst (e.g. Climate Modeling, Bio-tech, Soil Microbiome, Policy Economics): Temperature anomalies, Soil microbiome diversity index, Crop yield projections, Research publication trends.
        - For Government Official (e.g. Relief, Sentiment, Food Security, Infrastructure): Subsidy Disbursements, Buffer Stock Levels, Citizen Grievance count, Project budgets.
        - For Company Admin (e.g. API Health, User Access, Security): API latency, Daily active users, Security alert logs, System load.
        Ensure the chart title, labels, and values are highly specific to the role and current subpage topic.`;
        expectedFormat = commonSchema;
    }

    let translationInstruction = '';
    if (language !== 'English') {
        translationInstruction = `\nCRITICAL REQUIREMENT: Translate all user-facing string values in the JSON structure (e.g., 'single_line_summary', 'expanded_data_points', 'primary_metrics', 'actionable_steps', 'source_or_authority', and all chart 'title' and 'label' fields, as well as the values for lists of disruptions and sourcing risks like location, issue, region, crop, riskLevel, and quality) into ${language}. Keep all JSON keys strictly in English.`;
    }

    const promptText = `
      You are an expert AI data synthesizer for an agricultural news platform.
      ${systemInstruction}
      
      RAW NEWS CONTEXT:
      ${JSON.stringify(rawNewsContext)}
      
      INSTRUCTIONS:
      1. Carefully read the raw news context.
      2. Extract and format the information exactly to fit the following JSON schema, focusing the news feed, metrics, and charts specifically to relevance for the location: "${userLoc}". If the raw news doesn't mention it, infer how it affects this specific region.
      3. If the raw news does not explicitly contain enough info for a field, make highly educated realistic inferences based on the context (since this is a simulated demo overlaying live data).
      4. RETURN ONLY VALID JSON. Do not include markdown code blocks (\`\`\`json). Just the raw JSON string.
      ${translationInstruction}
      
      EXPECTED JSON SCHEMA:
      ${expectedFormat}
    `;

    try {
        // Race the AI call against a 5-second timeout to ensure fast fallback
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI synthesis timeout (5s)')), 5000));
        const res = await Promise.race([chatModel.invoke(promptText), timeoutPromise]);
        let content = res.content.trim();
        if (content.startsWith('```json')) content = content.slice(7);
        if (content.endsWith('```')) content = content.slice(0, -3);
        return JSON.parse(content);
    } catch (error) {
        console.error("AI Synthesis Error (Quota/Network):", error.message);
        console.warn("Serving fallback mocked data due to Gemini API failure.");
        
        let fsSync, pathSync, mockDataPath;
        if (typeof fs === 'undefined') {
            fsSync = await import('fs');
            pathSync = await import('path');
            const { fileURLToPath } = await import('url');
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = pathSync.dirname(__filename);
            mockDataPath = pathSync.join(__dirname, '../data/newsMockData.json');
        } else {
            fsSync = fs;
            pathSync = path;
            let __dirname = pathSync.dirname(new URL(import.meta.url).pathname);
            if (process.platform === 'win32' && __dirname.startsWith('/')) {
                __dirname = __dirname.substring(1);
            }
            mockDataPath = pathSync.join(__dirname, '../data/newsMockData.json');
        }

        try {
            const fileContent = fsSync.readFileSync(mockDataPath, 'utf8');
            const allMockData = JSON.parse(fileContent);
            const roleData = allMockData[role];
            
            if (roleData) {
                const key = subPath === '' ? 'default' : subPath;
                if (roleData[key]) {
                    let dataToTranslate = roleData[key];
                    
                    // Dynamic Location Replacements for Mock Data
                    if (userLoc && userLoc !== 'India') {
                        const parts = userLoc.split(',').map(p => p.trim());
                        const userCity = parts.length > 1 ? parts[0] : '';
                        const userState = parts.length > 1 ? parts[1] : parts[0];
                        
                        let jsonString = JSON.stringify(dataToTranslate);
                        
                        // Replace common default state names with the selected state
                        const mockStates = ["Punjab", "Haryana", "Gujarat", "Karnataka", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Andhra Pradesh", "Tamil Nadu", "Telangana", "Bihar", "Odisha", "West Bengal", "Kerala", "Assam"];
                        mockStates.forEach(s => {
                            const regex = new RegExp(s, 'gi');
                            jsonString = jsonString.replace(regex, userState);
                        });
                        jsonString = jsonString.replace(/\bUP\b/g, userState);
                        
                        // Replace generic or state-specific mandis/regions with the selected city
                        if (userCity) {
                            jsonString = jsonString.replace(/\bPunjab Mandis\b/gi, `${userCity} Mandi`);
                            jsonString = jsonString.replace(/\bHaryana Mandis\b/gi, `${userCity} Mandi`);
                            jsonString = jsonString.replace(/\bGujarat Mandis\b/gi, `${userCity} Mandi`);
                            jsonString = jsonString.replace(/\bUP Mandis\b/gi, `${userCity} Mandi`);
                            jsonString = jsonString.replace(/\bKarnataka Mandis\b/gi, `${userCity} Mandi`);
                            jsonString = jsonString.replace(/\bMaharashtra Mandis\b/gi, `${userCity} Mandi`);
                            jsonString = jsonString.replace(/\bLocal mandi\b/gi, `${userCity} mandi`);
                            jsonString = jsonString.replace(/\blocal mandi\b/gi, `${userCity} mandi`);
                        }
                        
                        dataToTranslate = JSON.parse(jsonString);

                        // Deterministic seed generation based on location name to vary mock data values
                        const getSeed = (str) => {
                            let hash = 0;
                            for (let i = 0; i < str.length; i++) {
                                hash = str.charCodeAt(i) + ((hash << 5) - hash);
                            }
                            return Math.abs(hash);
                        };

                        const locationSeed = getSeed(userLoc);

                        // Vary mock page chart data values deterministically based on location
                        if (dataToTranslate.page_charts && Array.isArray(dataToTranslate.page_charts)) {
                            dataToTranslate.page_charts.forEach((chart) => {
                                if (chart.data && Array.isArray(chart.data)) {
                                    chart.data.forEach((item) => {
                                        if (typeof item.value === 'number') {
                                            const pointSeed = getSeed(item.label + userLoc);
                                            const multiplier = 0.82 + (pointSeed % 37) * 0.01; // variations from -18% to +18%
                                            item.value = Math.round(item.value * multiplier);
                                        }
                                    });
                                }
                            });
                        }

                        // Reorder and subset mock accordion items deterministically based on location seed so that different cities display different stories
                        if (dataToTranslate.accordionItems && Array.isArray(dataToTranslate.accordionItems) && dataToTranslate.accordionItems.length > 0) {
                            const count = dataToTranslate.accordionItems.length;
                            const reordered = [];
                            for (let i = 0; i < count; i++) {
                                const pickIdx = (locationSeed + i) % count;
                                if (!reordered.includes(dataToTranslate.accordionItems[pickIdx])) {
                                    reordered.push(dataToTranslate.accordionItems[pickIdx]);
                                }
                            }
                            dataToTranslate.accordionItems.forEach(item => {
                                if (!reordered.includes(item)) {
                                    reordered.push(item);
                                }
                            });
                            // Select a subset of items (e.g., 3 to 5 items)
                            dataToTranslate.accordionItems = reordered.slice(0, Math.min(count, 3 + (locationSeed % 3)));
                        }

                        // Vary mock accordion items (summaries, primary metrics) deterministically based on location
                        if (dataToTranslate.accordionItems && Array.isArray(dataToTranslate.accordionItems)) {
                            dataToTranslate.accordionItems.forEach((item, idx) => {
                                const itemSeed = locationSeed + idx;
                                
                                // Vary prices and percentages in single_line_summary
                                if (item.single_line_summary) {
                                    item.single_line_summary = item.single_line_summary.replace(/₹([0-9,]+)/g, (match, p1) => {
                                        const val = parseInt(p1.replace(/,/g, ''), 10);
                                        if (isNaN(val)) return match;
                                        const adjusted = val + (itemSeed % 21 - 10) * 10;
                                        return `₹${adjusted.toLocaleString('en-IN')}`;
                                    });
                                    item.single_line_summary = item.single_line_summary.replace(/([0-9.]+)\s*(k|qt)/gi, (match, p1, p2) => {
                                        const val = parseFloat(p1);
                                        if (isNaN(val)) return match;
                                        const adjusted = (val * (0.8 + (itemSeed % 41) * 0.01)).toFixed(1);
                                        return `${adjusted} ${p2}`;
                                    });
                                }
                                
                                // Vary metrics values inside primary_metrics
                                if (item.expanded_data_points && item.expanded_data_points.primary_metrics) {
                                    const metrics = item.expanded_data_points.primary_metrics;
                                    for (const key in metrics) {
                                        if (typeof metrics[key] === 'string') {
                                            metrics[key] = metrics[key].replace(/₹([0-9,]+)/g, (match, p1) => {
                                                const val = parseInt(p1.replace(/,/g, ''), 10);
                                                if (isNaN(val)) return match;
                                                const adjusted = val + (itemSeed % 21 - 10) * 10;
                                                return `₹${adjusted.toLocaleString('en-IN')}`;
                                            });
                                            metrics[key] = metrics[key].replace(/([0-9.]+)\s*(k|qt)/gi, (match, p1, p2) => {
                                                const val = parseFloat(p1);
                                                if (isNaN(val)) return match;
                                                const adjusted = (val * (0.8 + (itemSeed % 41) * 0.01)).toFixed(1);
                                                return `${adjusted} ${p2}`;
                                            });
                                            metrics[key] = metrics[key].replace(/([+-][0-9.]+)%/g, (match, p1) => {
                                                const val = parseFloat(p1);
                                                if (isNaN(val)) return match;
                                                const adjusted = (val + (itemSeed % 11 - 5) * 0.5).toFixed(1);
                                                return `${adjusted > 0 ? '+' : ''}${adjusted}%`;
                                            });
                                        }
                                    }
                                }
                            });
                        }

                        // Vary disruptions and sourcing risk properties for Procurement Manager role
                        if (dataToTranslate.disruptions && Array.isArray(dataToTranslate.disruptions)) {
                            dataToTranslate.disruptions.forEach((item, idx) => {
                                const itemSeed = locationSeed + idx;
                                item.location = userCity || userState;
                                item.delay = item.delay.replace(/([0-9]+)\s*days?/gi, (match, p1) => {
                                    const days = parseInt(p1, 10);
                                    const adjusted = Math.max(1, days + (itemSeed % 3 - 1));
                                    return `${adjusted} days`;
                                });
                            });
                        }
                        if (dataToTranslate.sourcingRisk && Array.isArray(dataToTranslate.sourcingRisk)) {
                            dataToTranslate.sourcingRisk.forEach((item, idx) => {
                                const itemSeed = locationSeed + idx;
                                item.region = userState;
                                const risks = ["Low", "Medium", "High"];
                                item.riskLevel = risks[itemSeed % risks.length];
                            });
                        }
                    }
                    
                    const translatedData = await translateMockData(dataToTranslate, language);
                    return translatedData;
                }
            }
        } catch (e) {
            console.error("Failed to read dynamic mock data file:", e.message);
        }
        
        return { 
           accordionItems: [
             {
               ticker_type: "SYSTEM",
               single_line_summary: language === 'Hindi' ? "फ़ॉलबैक डेटा उपलब्ध नहीं है।" : "Fallback data not available.",
               expanded_data_points: {
                 primary_metrics: {},
                 actionable_steps: [],
                 source_or_authority: language === 'Hindi' ? "सिस्टम" : "System"
               }
             }
           ],
           page_charts: []
        };
    }

};

/**
 * Generate detailed information about a specific news headline using the AI API.
 * Falls back to a local intelligent simulation if quota is exceeded.
 */
export const getAiDetails = async (headline, role, language = 'English', location = 'India') => {
    let translationInstruction = '';
    if (language !== 'English') {
        translationInstruction = `\nCRITICAL REQUIREMENT: Output the analysis and recommendation strictly in ${language}.`;
    }
    
    const parts = location.split(',').map(p => p.trim());
    const userCity = parts.length > 1 ? parts[0] : '';
    const userState = parts.length > 1 ? parts[1] : parts[0];
    const cityDetails = getCityCropAndMandiDetails(userCity, userState);
    
    let cityInstruction = '';
    if (userCity && userCity !== 'India') {
        cityInstruction = `Ensure the summary is highly specific to the city of "${userCity}" (state of "${userState}"). 
        Mention how it affects local markets like "${cityDetails.localMandi}" or micro-climatic issues like "${cityDetails.localWeather}".`;
    }

    const promptText = `
      You are an expert AI agricultural analyst for the role: "${role}".
      Analyze the following agricultural news headline and provide a highly detailed, insightful, 3-sentence summary that explains the context, impact, and actionable recommendations, in the context of the user's location: "${location}".
      ${cityInstruction}
      ${translationInstruction}
      
      HEADLINE: "${headline}"
      
      RETURN ONLY THE PLAIN TEXT PARAGRAPH. No markdown formatting.
    `;

    try {
        // Race the AI call against a 5-second timeout
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI detailed synthesis timeout')), 5000));
        const res = await Promise.race([chatModel.invoke(promptText), timeoutPromise]);
        return res.content.trim();
    } catch (error) {
        console.error("AI Details Error (Quota/Network):", error.message);
        console.warn("Serving fallback mocked details due to Gemini API failure.");
        
        if (language === 'Hindi') {
            return `स्थान: ${location} के संदर्भ में, वास्तविक समय के बाजार विश्लेषण के आधार पर, "${headline}" एक ${role} के लिए परिचालन गतिशीलता में एक महत्वपूर्ण बदलाव का संकेत देता है। ऐतिहासिक रुझानों से पता चलता है कि इसी तरह की घटनाओं के परिणामस्वरूप अक्सर अगले हफ्तों में संबंधित कृषि सूचकांकों में 12-15% का उतार-चढ़ाव होता है। क्षेत्रीय आपूर्ति श्रृंखलाओं की बारीकी से निगरानी करने और संभावित व्यवधानों को कम करने के लिए आगे के अनुबंधों या परिचालन रसद को समायोजित करने की अत्यधिक अनुशंसा की जाती है।`;
        }
        
        // Highly realistic offline fallback
        return `In the context of ${location}, based on real-time market analysis, "${headline}" signals a significant shift in current operational dynamics for a ${role}. Historical trends suggest that similar events often result in a 12-15% fluctuation in associated agricultural indices over the following weeks. It is highly recommended to monitor regional supply chains closely and adjust forward contracts or operational logistics to mitigate potential disruptions.`;
    }
};
