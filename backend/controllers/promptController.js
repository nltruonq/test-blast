const Prompt = require("../models/Prompt");

const features = ["feedback1", "feedback2"];
const bands = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const types = ["ta", "cc", "lr", "gra"];
const fullTypes = ["Task Achievement", "Coherence and Cohesion", "Lexical Resource", "Grammatical Range & Accuracy"];
const fb1ta = [
    [
        "Responses of 20 words or fewer are rated at Band 1",
        "The content is wholly unrelated to the task",
        "Any copied rubric must be discounted",
    ],
    ["The content barely relates to the task"],
    [
        "The response does not address the requirements of the task (possibly because of misunderstanding of the data/diagram/situation)",
        "Key features/bullet points which are presented may be largely irrelevant",
        "Limited information is presented, and this may be used repetitively",
    ],
    [
        "The response is an attempt to address the task",
        "(Academic) Few key features have been selected",
        "(General Training) Not all bullet points are presented",
    ],
    [
        "The response generally addresses the requirements of the task. The format may be inappropriate in places",
        "(Academic) Key features which are selected are not adequately covered. The recounting of detail is mainly mechanical. There may be no data to support the description",
        "(General Training) All bullet points are presented but one or more may not be adequately covered. The purpose may be unclear at times. The tone may be variable and sometimes inappropriate",
        "There may be a tendency to focus on details (without referring to the bigger picture)",
    ],
    [
        "The response focuses on the requirements of the task and an appropriate format is used",
        "(Academic) Key features which are selected are covered and adequately highlighted. A relevant overview is attempted. Information is appropriately selected and supported using figures/data",
        "(General Training) All bullet points are covered and adequately highlighted. The purpose is generally clear. There may be minor inconsistencies in tone",
        "Some irrelevant, inappropriate or inaccurate information may occur in areas of detail or when illustrating or extending the main points",
    ],
    [
        "The response covers the requirements of the task",
        "The content is relevant and accurate – there may be a few omissions or lapses. The format is appropriate",
        "(Academic) Key features which are selected are covered and clearly highlighted but could be more fully or more appropriately illustrated or extended",
        "(Academic) It presents a clear overview, the data are appropriately categorised, and main trends or differences are identified",
    ],
    [
        "The response covers all the requirements of the task appropriately, relevantly and sufficiently",
        "(Academic) Key features are skilfully selected, and clearly presented, highlighted and illustrated",
    ],
    ["All the requirements of the task are fully and appropriately satisfied", "There may be extremely rare lapses in content"],
];
const fb1cc = [
    [
        "Responses of 20 words or fewer are rated at Band 1",
        "The writing fails to communicate any message and appears to be by a virtual non-writer",
    ],
    [
        "There is little relevant message, or the entire response may be off-topic",
        "There is little evidence of control of organisational features",
    ],
    [
        "There is no apparent logical organisation. Ideas are discernible but difficult to relate to each other",
        "Minimal use of sequencers or cohesive devices. Those used do not necessarily indicate a logical relationship between ideas",
        "There is difficulty in identifying referencing",
    ],
    [
        "Information and ideas are evident but not arranged coherently, and there is no clear progression within the response",
        "Relationships between ideas can be unclear and/or inadequately marked. There is some use of basic cohesive devices, which may be inaccurate or repetitive",
    ],
    [
        "Organisation is evident but is not wholly logical and there may be a lack of overall progression. Nevertheless, there is a sense of underlying coherence to the response",
        "The relationship of ideas can be followed but the sentences are not fluently linked to each other",
        "There may be limited/overuse of cohesive devices with some inaccuracy",
    ],
    [
        "Information and ideas are generally arranged coherently and there is a clear overall progression",
        "Cohesive devices are used to some good effect but cohesion within and/or between sentences may be faulty or mechanical due to misuse, overuse or omission",
        "The use of reference and substitution may lack flexibility or clarity and result in some repetition or error",
    ],
    [
        "Information and ideas are logically organised and there is a clear progression throughout the response. A few lapses may occur",
        "A range of cohesive devices including reference and substitution is used flexibly but with some inaccuracies or some over/under use",
    ],
    [
        "The message can be followed with ease",
        "Information and ideas are logically sequenced, and cohesion is well managed",
        "Occasional lapses in coherence or cohesion may occur",
    ],
    [
        "The message can be followed effortlessly",
        "Cohesion is used in such a way that it very rarely attracts attention",
        "Any lapses in coherence or cohesion are minimal",
        "Paragraphing is skilfully managed",
    ],
];
const fb1lr = [
    ["Responses of 20 words or fewer are rated at Band 1", "No resource is apparent, except for a few isolated words"],
    [
        "The resource is extremely limited with few recognisable strings, apart from memorised phrases",
        "There is no apparent control of word formation and/or spelling",
    ],
    [
        "The resource is inadequate (which may be due to the response being significantly underlength)",
        "Possible over-dependence on input material or memorised language",
        "Control of word choice and/or spelling is very limited, and errors predominate. These errors may severely impede meaning",
    ],
    [
        "The resource is limited and inadequate for or unrelated to the task. Vocabulary is basic and may be used repetitively",
        "There may be inappropriate use of lexical chunks (e.g. memorised phrases, formulaic language and/or language from the input material)",
        "Inappropriate word choice and/or errors in word formation and/or in spelling may impede meaning",
    ],
    [
        "The resource is limited but minimally adequate for the task",
        "Simple vocabulary may be used accurately but the range does not permit much variation in expression",
    ],
    [
        "The resource is generally adequate and appropriate for the task",
        "The meaning is generally clear in spite of a rather restricted range or a lack of precision in word choice",
        "If the writer is a risk-taker, there will be a wider range of vocabulary used but higher degrees of inaccuracy or inappropriacy",
    ],
    [
        "The resource is sufficient to allow some flexibility and precision",
        "There is some ability to use less common and/or idiomatic items",
        "An awareness of style and collocation is evident, though inappropriacies occur",
    ],
    [
        "A wide resource is fluently and flexibly used to convey precise meanings within the scope of the task",
        "There is skilful use of uncommon and/or idiomatic items when appropriate, despite occasional inaccuracies in word choice and collocation",
        "Occasional errors in spelling and/or word formation may occur, but have minimal impact on communication",
    ],
    [
        "Full flexibility and precise use are evident within the scope of the task",
        "A wide range of vocabulary is used accurately and appropriately with very natural and sophisticated control of lexical features",
        "Minor errors in spelling and word formation are extremely rare and have minimal impact on communication",
    ],
];
const fb1gra = [
    ["Responses of 20 words or fewer are rated at Band 1", "No rateable language is evident"],
    ["There is little or no evidence of sentence forms (except in memorised phrases)"],
    [
        "Sentence forms are attempted, but errors in grammar and punctuation predominate (except in memorised phrases or those taken from the input material). This prevents most meaning from coming through",
        "Length may be insufficient to provide evidence of control of sentence forms",
    ],
    ["A very limited range of structures is used", "Subordinate clauses are rare and simple sentences predominate"],
    [
        "The range of structures is limited and rather repetitive",
        "Although complex sentences are attempted, they tend to be faulty, and the greatest accuracy is achieved on simple sentences",
        "Grammatical errors may be frequent and cause some difficulty for the reader",
    ],
    [
        "A mix of simple and complex sentence forms is used but flexibility is limited",
        "Examples of more complex structures are not marked by the same level of accuracy as in simple structures",
    ],
    [
        "A variety of complex structures is used with some flexibility and accuracy",
        "Grammar and punctuation are generally well controlled, and error-free sentences are frequent",
    ],
    [
        "A wide range of structures within the scope of the task is flexibly and accurately used",
        "The majority of sentences are error-free, and punctuation is well managed",
    ],
    [
        "A wide range of structures within the scope of the task is used with full flexibility and control",
        "Punctuation and grammar are used appropriately throughout",
        "Minor errors are extremely rare and have minimal impact on communication",
    ],
];
const fb2ta = [
    [
        "Responses of 20 words or fewer are rated at Band 1",
        "The content is wholly unrelated to the prompt",
        "Any copied rubric must be discounted",
    ],
    [
        "The content is barely related to the prompt",
        "No position can be identified",
        "There may be glimpses of one or two ideas without development",
    ],
    [
        "No part of the prompt is adequately addressed, or the prompt has been misunderstood",
        "No relevant position can be identified, and/or there is little direct response to the question/s",
        "There are few ideas, and these may be irrelevant or insufficiently developed",
    ],
    [
        "The prompt is tackled in a minimal way, or the answer is tangential, possibly due to some misunderstanding of the prompt. The format may be inappropriate",
        "A position is discernible, but the reader has to read carefully to find it",
        "Main ideas are difficult to identify and such ideas that are identifiable may lack relevance, clarity and/or support",
        "Large parts of the response may be repetitive",
    ],
    [
        "The main parts of the prompt are incompletely addressed. The format may be inappropriate in places",
        "The writer expresses a position, but the development is not always clear",
        "Some main ideas are put forward, but they are limited and are not sufficiently developed and/or there may be irrelevant detail",
        "There may be some repetition",
    ],
    [
        "The main parts of the prompt are addressed (though some may be more fully covered than others). An appropriate format is used",
        "A position is presented that is directly relevant to the prompt, although the conclusions drawn may be unclear, unjustified or repetitive",
        "Main ideas are relevant, but some may be insufficiently developed or may lack clarity, while some supporting arguments and evidence may be less relevant or inadequate",
    ],
    [
        "The main parts of the prompt are appropriately addressed",
        "A clear and developed position is presented",
        "Main ideas are extended and supported but there may be a tendency to over-generalise or there may be a lack of focus and precision in supporting ideas/material",
    ],
    [
        "The prompt is appropriately and sufficiently addressed",
        "A clear and well-developed position is presented in response to the question/s",
        "Ideas are relevant, well extended and supported",
        "There may be occasional omissions or lapses in content",
    ],
    [
        "The prompt is appropriately addressed and explored in depth",
        "A clear and fully developed position is presented which directly answers the question/s",
        "Ideas are relevant, fully extended and well supported",
        "Any lapses in content or support are extremely rare",
    ],
];
const fb2cc = [
    [
        "Responses of 20 words or fewer are rated at Band 1",
        "The writing fails to communicate any message and appears to be by a virtual non-writer",
    ],
    [
        "There is little relevant message, or the entire response may be off-topic",
        "There is little evidence of control of organisational features",
    ],
    [
        "There is no apparent logical organisation. Ideas are discernible but difficult to relate to each other",
        "There is minimal use of sequencers or cohesive devices. Those used do not necessarily indicate a logical relationship between ideas",
        "There is difficulty in identifying referencing",
        "Any attempts at paragraphing are unhelpful",
    ],
    [
        "Information and ideas are evident but not arranged coherently and there is no clear progression within the response",
        "Relationships between ideas can be unclear and/or inadequately marked. There is some use of basic cohesive devices, which may be inaccurate or repetitive",
        "There is inaccurate use or a lack of substitution or referencing",
        "There may be no paragraphing and/or no clear main topic within paragraphs",
    ],
    [
        "Organisation is evident but is not wholly logical and there may be a lack of overall progression. Nevertheless, there is a sense of underlying coherence to the response",
        "The relationship of ideas can be followed but the sentences are not fluently linked to each other",
        "The writing may be repetitive due to inadequate and/or inaccurate use of reference and substitution",
        "There may be limited/overuse of cohesive devices with some inaccuracy",
        "Paragraphing may be inadequate or missing",
    ],
    [
        "Information and ideas are generally arranged coherently and there is a clear overall progression",
        "Cohesive devices are used to some good effect but cohesion within and/or between sentences may be faulty or mechanical due to misuse, overuse or omission",
        "The use of reference and substitution may lack flexibility or clarity and result in some repetition or error",
        "Paragraphing may not always be logical and/or the central topic may not always be clear",
    ],
    [
        "Information and ideas are logically organised, and there is a clear progression throughout the response (A few lapses may occur, but these are minor.)",
        "A range of cohesive devices including reference and substitution is used flexibly but with some inaccuracies or some over/under use",
        "Paragraphing is generally used effectively to support overall coherence, and the sequencing of ideas within a paragraph is generally logical",
    ],
    [
        "The message can be followed with ease",
        "Information and ideas are logically sequenced, and cohesion is well managed",
        "Occasional lapses in coherence and cohesion may occur",
        "Paragraphing is used sufficiently and appropriately",
    ],
    [
        "The message can be followed effortlessly",
        "Cohesion is used in such a way that it very rarely attracts attention",
        "Any lapses in coherence or cohesion are minimal",
        "Paragraphing is skilfully managed",
    ],
];
const fb2lr = [
    ["Responses of 20 words or fewer are rated at Band 1", "No resource is apparent, except for a few isolated words"],
    [
        "The resource is extremely limited with few recognisable strings, apart from memorised phrases",
        "There is no apparent control of word formation and/or spelling",
    ],
    [
        "The resource is inadequate (which may be due to the response being significantly underlength). Possible over-dependence on input material or memorised language",
        "Control of word choice and/or spelling is very limited, and errors predominate. These errors may severely impede meaning",
    ],
    [
        "The resource is limited and inadequate for or unrelated to the task. Vocabulary is basic and may be used repetitively",
        "There may be inappropriate use of lexical chunks (e.g. memorised phrases, formulaic language and/or language from the input material)",
        "Inappropriate word choice and/or errors in word formation and/or in spelling may impede meaning",
    ],
    [
        "The resource is limited but minimally adequate for the task",
        "Simple vocabulary may be used accurately but the range does not permit much variation in expression",
        "There may be frequent lapses in the appropriacy of word choice and a lack of flexibility is apparent in frequent simplifications and/or repetitions",
        "Errors in spelling and/or word formation may be noticeable and may cause some difficulty for the reader",
    ],
    [
        "The resource is generally adequate and appropriate for the task",
        "The meaning is generally clear in spite of a rather restricted range or a lack of precision in word choice",
        "If the writer is a risk-taker, there will be a wider range of vocabulary used but higher degrees of inaccuracy or inappropriacy",
        "There are some errors in spelling and/or word formation, but these do not impede communication",
    ],
    [
        "The resource is sufficient to allow some flexibility and precision",
        "There is some ability to use less common and/or idiomatic items",
        "An awareness of style and collocation is evident, though inappropriacies occur",
        "There are only a few errors in spelling and/or word formation and they do not detract from overall clarity",
    ],
    [
        "A wide resource is fluently and flexibly used to convey precise meanings",
        "There is skilful use of uncommon and/or idiomatic items when appropriate, despite occasional inaccuracies in word choice and collocation",
        "Occasional errors in spelling and/or word formation may occur, but have minimal impact on communication",
    ],
    [
        "Full flexibility and precise use are widely evident",
        "A wide range of vocabulary is used accurately and appropriately with very natural and sophisticated control of lexical features",
        "Minor errors in spelling and word formation are extremely rare and have minimal impact on communication",
    ],
];
const fb2gra = [
    ["Responses of 20 words or fewer are rated at Band 1", "No rateable language is evident"],
    ["There is little or no evidence of sentence forms (except in memorised phrases)"],
    [
        "Sentence forms are attempted, but errors in grammar and punctuation predominate (except in memorised phrases or those taken from the input material). This prevents most meaning from coming through",
        "Length may be insufficient to provide evidence of control of sentence forms",
    ],
    [
        "A very limited range of structures is used",
        "Some structures are produced accurately but grammatical errors are frequent and may impede meaning",
        "Subordinate clauses are rare and simple sentences predominate",
        "Punctuation is often faulty or inadequate",
    ],
    [
        "The range of structures is limited and rather repetitive",
        "Although complex sentences are attempted, they tend to be faulty, and the greatest accuracy is achieved on simple sentences",
        "Grammatical errors may be frequent and cause some difficulty for the reader",
        "Punctuation may be faulty",
    ],
    [
        "A mix of simple and complex sentence forms is used but flexibility is limited",
        "Examples of more complex structures are not marked by the same level of accuracy as in simple structures",
        "Errors in grammar and punctuation occur, but rarely impede communication",
    ],
    [
        "A variety of complex structures is used with some flexibility and accuracy",
        "Grammar and punctuation are generally well controlled, and error-free sentences are frequent",
        "A few errors in grammar may persist, but these do not impede communication",
    ],
    [
        "A wide range of structures is flexibly and accurately used",
        "The majority of sentences are error-free, and punctuation is well managed",
        "Occasional, non-systematic errors and inappropriacies occur, but have minimal impact on communication",
    ],
    [
        "A wide range of structures is used with full flexibility and control",
        "Punctuation and grammar are used appropriately throughout",
        "Minor errors are extremely rare and have minimal impact on communication",
    ],
];
const options = [
    "Develop a well-rounded position with fully extended, relevant, and well-supported ideas by elaborating on key points and providing concrete examples or evidence",
    "Optimize cohesive devices in such a way that it attracts no attention",
    "Improve sentence structures and punctuation by incorporating a diverse mix of grammatically accurate and properly punctuated simple, compound, and complex sentences",
    "Optimize paragraph structure by ensuring an introduction, two or three body paragraphs, and a conclusion with smooth transitions and topic sentences",
    "Deepen prompt exploration by adding detailed explanations and insights relevant to the question",
];
const contents = [fb1ta, fb1cc, fb1lr, fb1gra, fb2ta, fb2cc, fb2lr, fb2gra];

const promptController = {
    getAllPrompt: async (req, res) => {
        try {
            const q = req.query;
            const prompts = await Prompt.find(q);
            return res.status(200).json(prompts);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    addPrompt: async (req, res) => {
        const prompt = req.body;
        try {
            const newPrompt = new Prompt({
                feature: prompt.feature,
                band: prompt.band,
                content: prompt.content,
                type:
                    prompt.fullType === fullTypes[0]
                        ? "ta"
                        : prompt.fullType === fullTypes[1]
                        ? "cc"
                        : prompt.fullType === fullTypes[2]
                        ? "lr"
                        : "gra",
                fullType: prompt.fullType,
                orderBy: prompt.orderBy,
            });
            const savePrompt = await newPrompt.save();
            return res.status(200).json(savePrompt);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    addAllPrompt: async (req, res) => {
        // const prompt = req.body;
        try {
            let loop = 0;
            for (const feature of features) {
                for (const type of types) {
                    const content = contents[loop];
                    for (const band of bands) {
                        let orderNumber = 1;
                        for (const ct of content[parseInt(band) - 1]) {
                            const newPrompt = new Prompt({
                                feature: feature,
                                band: band,
                                content: ct,
                                type: type,
                                fullType:
                                    type === "ta"
                                        ? fullTypes[0]
                                        : type === "cc"
                                        ? fullTypes[1]
                                        : type === "lr"
                                        ? fullTypes[2]
                                        : fullTypes[3],
                                orderBy: orderNumber,
                            });
                            const savePrompt = await newPrompt.save();
                            orderNumber++;
                        }
                    }
                    loop++;
                }
            }
            for (let i = 0; i < options.length; i++) {
                const newPrompt = new Prompt({
                    feature: "refine",
                    content: options[i],
                    orderBy: i + 1,
                });
                const savePrompt = await newPrompt.save();
            }
            return res.status(200).json({ message: "OK!" });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    deletePrompt: async (req, res) => {
        const promptId = req.params.id;
        try {
            await Prompt.findByIdAndDelete(promptId);
            return res.status(200).json({ message: "Prompt deleted" });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    updatePrompt: async (req, res) => {
        const prompt = req.body;
        const id = req.params.id;
        try {
            const newPrompt = await Prompt.findByIdAndUpdate(id, { $set: prompt }, { returnDocument: "after" });
            return res.status(200).json(newPrompt);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = promptController;
