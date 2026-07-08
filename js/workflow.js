/* NLP Knowledge Repository — Concept cards + workflow diagrams */

(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  const template = document.getElementById('conceptCardTemplate');
  const grid = document.getElementById('conceptCardsGrid');
  const iconMap = {
    segmentation: '🧾',
    tokenization: '🔤',
    normalization: '🌡️',
    stopwords: '🧹',
    stemming: '✂️',
    lemmatization: '📘',
    noise: '🌀',
    cleaning: '🧼',

    bow: '📦',
    ngrams: '🧱',
    tf: '📈',
    idf: '🧮',
    tfidf: '⚖️',

    onehot: '🧠',
    embeddings: '🕸️',
    word2vec: '🏗️',
    fasttext: '🧬',
    contextual: '✨',

    statlm: '📊',
    neurallm: '🧠',
    transformer: '🌐'
  };

  // Concepts are ordered by an explicit `order` field to keep the grid consistent.
  const concepts = [
    // Text Preprocessing (8)
    {
      order: 1,
      key: 'sentence segmentation',
      category: 'Text Preprocessing',
      icon: iconMap.segmentation,
      title: 'Sentence Segmentation',
      definition: 'Sentence segmentation splits a paragraph into sentence units so later steps can treat language structure more reliably.',
      purpose: 'To detect sentence boundaries for tasks like classification, summarization, and preprocessing pipelines.',
      why: 'Without sentence boundaries, token-level features may mix unrelated contexts.',
      workingPrinciple: 'The algorithm identifies boundaries using cues such as punctuation (., !, ?), capitalization patterns, and (in advanced systems) learned models that resolve ambiguity like “Dr.” or abbreviations.',
      steps: ['Normalize whitespace.', 'Detect candidate boundary punctuation.', 'Disambiguate abbreviations and special cases.', 'Output a list of sentences.'],
      example: 'Input: “Dr. Rao arrived at 5 p.m. Is she ready?” → Output: [“Dr. Rao arrived at 5 p.m.”, “Is she ready?”]',
      advantages: ['Improves structure-aware features.', 'Reduces context mixing.', 'Supports downstream tasks needing sentence granularity.'],
      limitations: ['Ambiguity with abbreviations.', 'Mixed punctuation in social media.', 'Requires language-specific rules or models.'],
      applications: ['Text summarization and chunking.', 'Training data preparation.', 'Context windows for language models.'],
      takeaways: ['Use punctuation cues, but resolve ambiguity.', 'Sentence boundaries influence later token features.'],
      viz: ['Dr.', 'Rao', 'arrived', 'at', '5', 'p.m.', 'Is she ready?']
    },
    {
      order: 2,
      key: 'tokenization',
      category: 'Text Preprocessing',
      icon: iconMap.tokenization,
      title: 'Tokenization',
      definition: 'Tokenization converts raw text into smaller units called tokens (words, subwords, or characters).',
      purpose: 'To create discrete units for feature extraction and model input.',
      why: 'Models cannot directly read raw characters consistently; they rely on standardized units.',
      workingPrinciple: 'Tokenizers segment text based on whitespace, punctuation, and language rules; modern pipelines may use subword tokenization to handle rare words.',
      steps: ['Normalize line breaks.', 'Split by whitespace and punctuation.', 'Handle contractions and hyphens.', 'Optionally apply subword splitting.', 'Return token sequence.'],
      example: 'Input: “NLP—week1 is fun!” → Tokens: [“NLP”, “—”, “week1”, “is”, “fun”, “!”] (or subwords in advanced settings).',
      advantages: ['Enables consistent representation.', 'Supports vocabulary construction.', 'Improves training efficiency.'],
      limitations: ['Token boundaries can be ambiguous.', 'Different tokenization choices change features.', 'Covers only what the tokenizer design allows.'],
      applications: ['Text classification and retrieval.', 'Sequence modeling for language tasks.', 'Vocabulary and embedding training.'],
      takeaways: ['Token boundaries matter.', 'Choose token granularity based on the model.'],
      viz: ['NLP', 'week1', 'is', 'fun!']
    },
    {
      order: 3,
      key: 'case normalization',
      category: 'Text Preprocessing',
      icon: iconMap.normalization,
      title: 'Case Normalization',
      definition: 'Case normalization converts words into a consistent casing format (often lowercase).',
      purpose: 'To reduce duplicate forms of the same word caused by capitalization.',
      why: 'Without normalization, “Data” and “data” become separate tokens, fragmenting statistics.',
      workingPrinciple: 'Apply a casing rule (e.g., lowercase everything). For named entities or models that require case, keep casing selectively.',
      steps: ['Decide casing policy (lowercase, preserve, or selective).', 'Transform each token accordingly.', 'Keep special tokens (e.g., acronyms) if needed.', 'Proceed with further cleaning.'],
      example: 'Input: “AI is useful. ai tools scale.” → Lowercased: [“ai”, “is”, “useful.”, “ai”, “tools”, “scale.”]',
      advantages: ['More robust counts.', 'Simplifies vocabulary.', 'Reduces sparsity in bag-of-words models.'],
      limitations: ['May lose information for proper nouns.', 'Can hurt tasks needing capitalization cues.', 'Language-dependent behavior.'],
      applications: ['Search indexing.', 'TF/IDF feature extraction.', 'Baseline text classification.'],
      takeaways: ['Lowercasing reduces sparsity.', 'Be careful when case conveys meaning.'],
      viz: ['AI', 'is', 'useful', 'ai', 'tools', 'scale']
    },
    {
      order: 4,
      key: 'stop-word removal',
      category: 'Text Preprocessing',
      icon: iconMap.stopwords,
      title: 'Stop-word Removal',
      definition: 'Stop-word removal removes very frequent words (like “the”, “is”, “and”) that often contribute limited meaning in bag-of-words models.',
      purpose: 'To reduce noise and focus on content-bearing words.',
      why: 'High-frequency function words can dominate TF counts and reduce signal-to-noise.',
      workingPrinciple: 'Use a language-specific stop-word list and optionally keep stop-words in tasks where they matter (negations, phrasing).',
      steps: ['Prepare stop-word list.', 'Tokenize text.', 'Remove tokens that match the list (with exceptions).', 'Return cleaned token sequence.'],
      example: 'Input: “The movie is not good.” → Remove “the”, “is” (but keep “not”) → [“movie”, “not”, “good”].',
      advantages: ['Smaller vocabulary.', 'Faster training and retrieval.', 'Often improves relevance in classic models.'],
      limitations: ['May remove meaningful words.', 'Negations can be mishandled.', 'Not always beneficial for embeddings or transformers.'],
      applications: ['TF/IDF pipelines.', 'Baseline information retrieval.', 'Text classification with sparse features.'],
      takeaways: ['Remove cautiously; meaning can live in stop words.', 'Keep critical words like negations.'],
      viz: ['movie', 'not', 'good']
    },
    {
      order: 5,
      key: 'stemming',
      category: 'Text Preprocessing',
      icon: iconMap.stemming,
      title: 'Stemming',
      definition: 'Stemming reduces a word to a shorter form using heuristic rules, typically approximating its root.',
      purpose: 'To group related word variants for simpler matching and modeling.',
      why: 'Morphological variations inflate vocabulary and sparsity (e.g., “running”, “runs”).',
      workingPrinciple: 'Rules strip suffixes based on patterns. The output may be a non-word “stem”.',
      steps: ['Identify common suffixes (e.g., -ing, -ed).', 'Remove suffix if rule conditions match.', 'Optionally apply additional cleanup steps.', 'Return stem.'],
      example: '“running”, “runner”, “runs” → stems like [“run”, “runner”→“runner”/“run” depending on rules].',
      advantages: ['Fast and lightweight.', 'Improves recall in retrieval tasks.', 'Works well for baseline tasks.'],
      limitations: ['May conflate unrelated words.', 'Stems may not be linguistically valid.', 'Rule quality depends on language and corpus.'],
      applications: ['Search term normalization.', 'Classic text classification baselines.', 'Lighter pipelines where compute is limited.'],
      takeaways: ['Heuristic root reduction.', 'Great for speed; not always for precision.'],
      viz: ['run', 'run', 'run']
    },
    {
      order: 6,
      key: 'lemmatization',
      category: 'Text Preprocessing',
      icon: iconMap.lemmatization,
      title: 'Lemmatization',
      definition: 'Lemmatization converts a word to its dictionary base form (lemma), typically using linguistic context like POS.',
      purpose: 'To normalize words more accurately than stemming.',
      why: 'Correct base forms improve consistency and reduce semantic fragmentation.',
      workingPrinciple: 'A lemmatizer analyzes part of speech and then selects a lemma from a lexical resource.',
      steps: ['Tokenize and tag part of speech.', 'Look up possible lemmas for the word.', 'Choose the lemma consistent with POS.', 'Return lemma sequence.'],
      example: '“better” (adj) → “good”; “running” (verb) → “run”.',
      advantages: ['More accurate normalization.', 'Produces valid lemmas.', 'Often improves model quality.'],
      limitations: ['Needs POS tagging/lexicon.', 'More compute than stemming.', 'Resource coverage varies by language.'],
      applications: ['Linguistic analysis.', 'Search ranking enhancements.', 'Better feature normalization for classification.'],
      takeaways: ['Lemmas are usually dictionary-valid.', 'Use when precision in normalization matters.'],
      viz: ['good', 'run', 'organize']
    },
    {
      order: 7,
      key: 'noise removal',
      category: 'Text Preprocessing',
      icon: iconMap.noise,
      title: 'Noise Removal',
      definition: 'Noise removal removes irrelevant or harmful artifacts like extra punctuation, HTML fragments, URLs, and repeated characters.',
      purpose: 'To reduce distractions that degrade token quality and feature statistics.',
      why: 'Noisy inputs skew frequency counts and confuse embeddings and models.',
      workingPrinciple: 'Apply pattern-based cleaning: URLs/mentions removal, normalize repeated punctuation, remove HTML tags, and standardize whitespace.',
      steps: ['Detect and remove URLs and markup.', 'Normalize repeated characters (e.g., “soooo” → “so”).', 'Reduce repeated punctuation (“!!!” → “!”).', 'Trim extra whitespace.'],
      example: 'Input: “Wow!!! Check https://x.com nowww” → “Wow! Check now”.',
      advantages: ['More stable tokens.', 'Improves downstream learning.', 'Reduces vocabulary waste.'],
      limitations: ['Over-removal can delete meaningful signals.', 'Harder for multilingual text.', 'Requires careful pattern design.'],
      applications: ['Social media analytics.', 'Spam detection.', 'Preprocessing for sentiment and classification.'],
      takeaways: ['Cleaning protects representation quality.', 'Balance removal and information preservation.'],
      viz: ['Wow!', 'Check', 'now']
    },
    {
      order: 8,
      key: 'text cleaning',
      category: 'Text Preprocessing',
      icon: iconMap.cleaning,
      title: 'Text Cleaning',
      definition: 'Text cleaning is the overall process of preparing raw text by normalizing, removing noise, and standardizing formatting.',
      purpose: 'To create consistent, model-friendly text inputs.',
      why: 'Raw text often includes inconsistent spacing, encoding artifacts, and formatting symbols.',
      workingPrinciple: 'Combine multiple cleanup operations: Unicode normalization, whitespace normalization, punctuation handling, and stripping unwanted artifacts.',
      steps: ['Unicode normalization (e.g., normalize quotes).', 'Whitespace normalization.', 'Strip non-text characters (configurable).', 'Standardize punctuation.', 'Output clean text.'],
      example: 'Input: “Hello\u00A0world —\nNLP” → “Hello world — NLP”.',
      advantages: ['Improves consistency across datasets.', 'Reduces spurious differences.', 'Helps tokenizers and embeddings behave better.'],
      limitations: ['Cleaning rules may be dataset-specific.', 'Too aggressive cleaning can remove meaning.', 'Needs evaluation to avoid bias.'],
      applications: ['Training data preparation.', 'ETL for NLP pipelines.', 'Robust text ingestion for applications.'],
      takeaways: ['Cleaning is a pipeline, not a single step.', 'Test cleaning rules on representative samples.'],
      viz: ['Hello', 'world', 'NLP']
    },

    // Feature Engineering (5)
    {
      order: 9,
      key: 'bag of words',
      category: 'Feature Engineering',
      icon: iconMap.bow,
      title: 'Bag of Words (BoW)',
      definition: 'Bag of Words represents a document by the counts (or weights) of tokens, ignoring word order.',
      purpose: 'To transform text into a fixed-size vector for classical machine learning models.',
      why: 'Many models require numerical features, and BoW provides a simple, interpretable representation.',
      workingPrinciple: 'Build a vocabulary from the corpus and represent each document as a vector over that vocabulary using counts or weights.',
      steps: ['Collect a corpus.', 'Build vocabulary of tokens.', 'Count token occurrences per document.', 'Optionally apply weighting (TF or TF-IDF).', 'Feed vector into a model.'],
      example: 'Document A: “cats chase mice” → {cats:1, chase:1, mice:1}. Document B: “mice eat cheese” → {mice:1, eat:1, cheese:1}.',
      advantages: ['Fast to compute.', 'Interpretable features.', 'Works well as a baseline for retrieval and classification.'],
      limitations: ['Ignores word order and syntax.', 'Large vocabularies lead to sparse vectors.', 'May miss context and semantics.'],
      applications: ['Spam detection.', 'Topic classification.', 'Search ranking baselines.'],
      takeaways: ['BoW trades linguistic structure for simplicity.', 'Pair with weighting for stronger performance.'],
      viz: ['cats', 'chase', 'mice']
    },
    {
      order: 10,
      key: 'n-grams',
      category: 'Feature Engineering',
      icon: iconMap.ngrams,
      title: 'N-Grams',
      definition: 'N-grams are contiguous sequences of n tokens, used to capture short-range order information.',
      purpose: 'To enrich BoW by including local word order patterns.',
      why: 'Pure BoW loses phrase-level cues like “not good” or “machine learning”.',
      workingPrinciple: 'Create features for each n-gram by sliding a window over tokens and counting occurrences.',
      steps: ['Tokenize the document.', 'Choose n (e.g., 2 for bigrams).', 'Generate sequences using a sliding window.', 'Count or weight each n-gram.', 'Form the feature vector.'],
      example: 'Tokens: [not, good, at, all]. Bigrams: [not good], [good at], [at all].',
      advantages: ['Captures local word order.', 'Improves phrase sensitivity.', 'Still compatible with sparse ML models.'],
      limitations: ['Feature space grows quickly with n.', 'Rare phrases may be sparse.', 'Still limited to short context.'],
      applications: ['Sentiment analysis.', 'Language modeling baselines.', 'Detecting common expressions.'],
      takeaways: ['N-grams add limited order.', 'Choose n carefully to balance accuracy and sparsity.'],
      viz: ['not good', 'good at', 'at all']
    },
    {
      order: 11,
      key: 'term frequency',
      category: 'Feature Engineering',
      icon: iconMap.tf,
      title: 'TF (Term Frequency)',
      definition: 'TF measures how frequently a term appears in a document.',
      purpose: 'To weight tokens based on their repetition within the document.',
      why: 'Words that appear more often often indicate topical relevance.',
      workingPrinciple: 'Compute TF as the raw count or a normalized variant such as dividing by total terms in the document.',
      steps: ['Tokenize the document.', 'Count occurrences of each term.', 'Optionally normalize (e.g., by document length).', 'Use TF values as weights.', 'Construct the vector.'],
      example: 'In a document of 100 tokens, “protein” appears 8 times → TF(protein)=8 (or 0.08 when normalized).',
      advantages: ['Simple and interpretable.', 'Fast to compute.', 'Useful for initial retrieval and baselines.'],
      limitations: ['Common corpus terms can dominate.', 'Ignores how rare a term is across documents.'],
      applications: ['Early-stage document scoring.', 'Complementary weighting (e.g., TF-IDF).'],
      takeaways: ['TF is about within-document emphasis.', 'Consider TF-IDF to correct corpus commonness.'],
      viz: ['protein:8', 'cell:3', 'gene:2']
    },
    {
      order: 12,
      key: 'inverse document frequency',
      category: 'Feature Engineering',
      icon: iconMap.idf,
      title: 'IDF (Inverse Document Frequency)',
      definition: 'IDF reduces the weight of terms that appear in many documents and increases the weight of rare, potentially informative terms.',
      purpose: 'To prefer discriminative terms during vectorization.',
      why: 'A word appearing everywhere (e.g., “system”) may not distinguish documents.',
      workingPrinciple: 'Compute document frequency df(t) and set IDF as log(N/df(t)), where N is the total number of documents.',
      steps: ['Choose a corpus.', 'Compute df(t) for each term.', 'Compute N (number of documents).', 'Apply smoothing if needed.', 'Return IDF weights.'],
      example: 'If “quantum” appears in 10 out of 10,000 docs: IDF ≈ log(10000/10)=log(1000) ≈ 6.9 (higher discrimination).',
      advantages: ['Highlights rare informative words.', 'Improves retrieval and classification baselines.', 'Reduces influence of frequent terms.'],
      limitations: ['Depends on corpus composition.', 'Assumes bag-of-words independence.', 'May be unstable with small corpora.'],
      applications: ['Feature weighting in TF-IDF vectors.', 'Vocabulary selection and filtering.'],
      takeaways: ['IDF captures global rarity.', 'Pair with TF for balanced weighting.'],
      viz: ['common term:low IDF', 'rare term:high IDF']
    },
    {
      order: 13,
      key: 'tf-idf',
      category: 'Feature Engineering',
      icon: iconMap.tfidf,
      title: 'TF-IDF',
      definition: 'TF-IDF combines term frequency with inverse document frequency to weight terms by both importance in the document and rarity in the corpus.',
      purpose: 'To produce more effective sparse features for retrieval and learning algorithms.',
      why: 'TF alone overemphasizes frequent words; TF-IDF corrects that using corpus-level statistics.',
      workingPrinciple: 'Multiply TF(t,d) by IDF(t): TF-IDF(t,d)=TF(t,d)·log(N/df(t)).',
      steps: ['Build vocabulary.', 'Compute TF per document.', 'Compute IDF from the corpus.', 'Multiply TF and IDF for each term.', 'Use resulting vectors for ML or similarity.'],
      example: 'Two docs both mention “learning”. If one doc repeats it but the other contains it rarely, TF-IDF helps balance frequency and rarity.',
      advantages: ['Strong baseline for classification.', 'Interpretable weights.', 'Improves similarity scoring.', 'Easy to implement.'],
      limitations: ['Ignores word order.', 'High dimensionality and sparsity.', 'Less effective when semantic similarity is needed without synonym matching.'],
      applications: ['Document classification.', 'Information retrieval.', 'Keyword extraction baselines.'],
      takeaways: ['TF gives local importance; IDF gives global distinctiveness.', 'Works great as a baseline; embeddings add semantics.'],
      viz: ['learning (mid TF × IDF)', 'transformers (high IDF)']
    },

    // Language Representation (6)
    {
      order: 14,
      key: 'one-hot encoding',
      category: 'Language Representation',
      icon: iconMap.onehot,
      title: 'One-Hot Encoding',
      definition: 'One-hot encoding represents each token as a sparse vector with a single 1 and zeros elsewhere.',
      purpose: 'To convert categorical tokens into numeric vectors for models.',
      why: 'Machine learning models operate on numeric inputs; one-hot is a straightforward mapping.',
      workingPrinciple: 'Create a vocabulary index for tokens; encode each token by setting its vocabulary index position to 1.',
      steps: ['Build vocabulary.', 'Assign each token an index.', 'Initialize a zero vector of vocab size.', 'Set the token’s index position to 1.', 'Feed into a model.'],
      example: 'Vocabulary: [cat, dog, fish]. Token “dog” → [0,1,0].',
      advantages: ['Simple mapping.', 'No training required for mapping itself.', 'Deterministic and interpretable.'],
      limitations: ['Dimensionality grows with vocabulary.', 'No semantic similarity signal.', 'Inefficient for large vocabularies.'],
      applications: ['Introductory NLP examples.', 'Small-scale models.', 'Feature baselines.'],
      takeaways: ['One-hot encodes identity, not meaning.', 'Use embeddings for semantic relationships.'],
      viz: ['cat','dog','fish']
    },
    {
      order: 15,
      key: 'word embeddings',
      category: 'Language Representation',
      icon: iconMap.embeddings,
      title: 'Word Embeddings',
      definition: 'Word embeddings map tokens into dense vectors in a continuous space where semantic similarity is reflected by geometric proximity.',
      purpose: 'To provide models with a compact representation capturing meaning and relationships.',
      why: 'Classical sparse vectors struggle with synonymy and semantic generalization.',
      workingPrinciple: 'Learn vectors so that words appearing in similar contexts obtain nearby representations.',
      steps: ['Choose an embedding dimension.', 'Define a training objective based on context.', 'Train on a corpus.', 'Normalize or keep learned vectors.', 'Use vectors as inputs to ML models.'],
      example: 'If “doctor” and “nurse” occur in similar contexts, their embedding vectors are close, enabling similarity search.',
      advantages: ['Captures semantic similarity.', 'Lower dimensional than one-hot.', 'Improves generalization across word variants.'],
      limitations: ['Training is data-dependent.', 'Out-of-vocabulary words require special handling.', 'Embeddings may not capture rare-domain jargon without data.'],
      applications: ['Semantic search.', 'Text classification features.', 'Clustering and analogy tasks.'],
      takeaways: ['Embeddings replace identity with meaning geometry.', 'Different training methods (Word2Vec, FastText) impact robustness.'],
      viz: ['doctor ~ nurse', 'car ~ vehicle']
    },
    {
      order: 16,
      key: 'word2vec',
      category: 'Language Representation',
      icon: iconMap.word2vec,
      title: 'Word2Vec',
      definition: 'Word2Vec learns embeddings by predicting a target word from its context or predicting context from a target word.',
      purpose: 'To create useful word vectors efficiently from large corpora.',
      why: 'A predictive context-based objective encourages semantic and syntactic regularities.',
      workingPrinciple: 'Two common architectures exist: CBOW predicts the target word from surrounding context; Skip-gram predicts surrounding words from the target.',
      steps: ['Pick CBOW or Skip-gram.', 'Select a context window size.', 'Generate training pairs (word, context).', 'Train to minimize prediction loss.', 'Extract learned embedding vectors.'],
      example: 'For window size 2: “I enjoy deep learning” → predict “learning” using context [“deep”,”learning” neighbor words], and vice versa.',
      advantages: ['Efficient training.', 'Often strong baseline embeddings.', 'Good for semantic similarity tasks.'],
      limitations: ['Limited handling of OOV words.', 'Assumes fixed-size context window.', 'May struggle with polysemy (multiple meanings) without extensions.'],
      applications: ['Similarity search.', 'Document classification.', 'Embedding-based retrieval.'],
      takeaways: ['Word2Vec uses prediction to shape the embedding space.', 'Great baseline; consider FastText for subword robustness.'],
      viz: ['king ~ queen', 'run ~ running (variant)']
    },
    {
      order: 17,
      key: 'fasttext',
      category: 'Language Representation',
      icon: iconMap.fasttext,
      title: 'FastText',
      definition: 'FastText extends Word2Vec by representing words as sums of vectors for character n-grams.',
      purpose: 'To improve robustness for rare words and out-of-vocabulary (OOV) tokens.',
      why: 'Subword information helps embeddings generalize even when a whole word was not seen in training.',
      workingPrinciple: 'Create embeddings from multiple character n-gram vectors and sum them to represent the word.',
      steps: ['Break each word into character n-grams.', 'Learn vectors for each n-gram.', 'Sum n-gram vectors to represent a word.', 'Train using a predictive objective over contexts.', 'Use resulting subword-based word vectors.'],
      example: 'OOV word “biodegradable” can still get an embedding from n-grams like “bio”, “degrad”, “-able”.',
      advantages: ['Handles OOV better.', 'Captures morphological patterns.', 'Often improves performance on noisy text.'],
      limitations: ['More complex model with more subword components.', 'Subword choices can affect results.'],
      applications: ['Language identification with noisy text.', 'Search over morphologically rich languages.', 'Robust embedding features.'],
      takeaways: ['Subword modeling improves generalization.', 'Useful when vocabulary coverage is limited.'],
      viz: ['bio', 'degrad', 'able']
    },
    {
      order: 18,
      key: 'contextual embeddings',
      category: 'Language Representation',
      icon: iconMap.contextual,
      title: 'Contextual Embeddings',
      definition: 'Contextual embeddings produce token vectors that change depending on surrounding words, enabling context-aware meaning.',
      purpose: 'To represent words with their meaning in the specific sentence.',
      why: 'Many words are ambiguous (“bank”, “plant”). Static embeddings cannot change with context.',
      workingPrinciple: 'Deep models (often transformer-based) attend to context and compute vectors per token conditioned on surrounding tokens.',
      steps: ['Tokenize input text.', 'Use a deep encoder to process the sequence.', 'Compute attention-based contextual states.', 'Extract token vectors (or pooled sentence vectors).', 'Feed embeddings to downstream tasks.'],
      example: '“I sat on the bank.” vs “He built a bank.” → contextual vectors differ for “bank” because context guides meaning.',
      advantages: ['Better handling of polysemy.', 'Captures long-range dependencies.', 'Strong transfer learning performance.'],
      limitations: ['Higher compute cost.', 'Requires training or large pre-trained models.', 'May require careful tokenization for best results.'],
      applications: ['Question answering.', 'Named entity recognition.', 'Text similarity with strong semantic cues.'],
      takeaways: ['Embeddings are context-dependent.', 'Transformers typically power contextual representations.'],
      viz: ['bank (river)', 'bank (company)']
    },

    // Language Models (3)
    {
      order: 19,
      key: 'statistical language models',
      category: 'Language Models',
      icon: iconMap.statlm,
      title: 'Statistical Language Models',
      definition: 'Statistical language models estimate the probability of token sequences using frequency-based statistics.',
      purpose: 'To score how likely a sentence is and to support generation or prediction.',
      why: 'Probability modeling enables tasks like autocomplete and next-token prediction.',
      workingPrinciple: 'Often uses n-gram probabilities with smoothing: P(w_i | w_{i-n+1}…w_{i-1}).',
      steps: ['Choose n-gram order (e.g., bigram, trigram).', 'Count n-grams in training text.', 'Apply smoothing for unseen events.', 'Compute conditional probabilities.', 'Use probabilities for scoring or sampling.'],
      example: 'For bigrams: “The cat sat” uses P(sat | cat) from counts.',
      advantages: ['Interpretability and simplicity.', 'Lower compute than large neural models.', 'Good for certain constrained settings.'],
      limitations: ['Limited context window.', 'Sparsity for higher n-grams.', 'Hard to generalize to unseen phrases.'],
      applications: ['Autocomplete baselines.', 'Speech recognition decoding.', 'Classic text generation.'],
      takeaways: ['Uses counts and smoothing.', 'Context depends on n-gram order.'],
      viz: ['P(sat|cat)', 'P(cat|the)']
    },
    {
      order: 20,
      key: 'neural language models',
      category: 'Language Models',
      icon: iconMap.neurallm,
      title: 'Neural Language Models',
      definition: 'Neural language models use neural networks to learn probability distributions over sequences.',
      purpose: 'To model context more flexibly than fixed n-gram counts.',
      why: 'Neural networks can learn distributed representations and capture patterns from data.',
      workingPrinciple: 'A network learns embeddings and predicts the next token (or masked tokens) using learned contextual representations.',
      steps: ['Tokenize and embed tokens.', 'Pass embeddings through neural layers.', 'Predict token distributions via softmax.', 'Train with cross-entropy loss.', 'Use the model for next-token prediction.'],
      example: 'Given “I love machine learning”, predict likely next tokens like “models” or “algorithms”.',
      advantages: ['Better generalization than pure n-grams.', 'Captures more context.', 'Leverages transfer learning.'],
      limitations: ['Needs training data and compute.', 'Can still produce errors and uncertainty.', 'Model size affects latency and cost.'],
      applications: ['Text generation and completion.', 'Language modeling for downstream NLP.', 'Pretraining for representation learning.'],
      takeaways: ['Learned representations power probability estimation.', 'Typically more context-aware than statistical models.'],
      viz: ['next-token distribution']
    },
    {
      order: 21,
      key: 'transformer-based representations',
      category: 'Language Models',
      icon: iconMap.transformer,
      title: 'Transformer-based Representations',
      definition: 'Transformer-based representations use attention mechanisms to build contextual representations for tokens and sequences.',
      purpose: 'To enable powerful sequence modeling and transfer learning across many NLP tasks.',
      why: 'Attention allows models to focus on relevant parts of the input and capture long-range dependencies.',
      workingPrinciple: 'The transformer uses self-attention to relate each token to all others, producing contextual states used for predictions or embedding extraction.',
      steps: ['Compute token embeddings.', 'Apply self-attention layers.', 'Combine information across positions.', 'Use feed-forward layers for non-linear transformation.', 'Output contextual representations.'],
      example: 'In a question, attention highlights key terms that support the answer span.',
      advantages: ['Captures long-range dependencies.', 'Parallelizable training.', 'Strong performance with pretraining.'],
      limitations: ['High compute and memory requirements.', 'Requires careful tokenization and batching.', 'Can still misinterpret inputs without grounding.'],
      applications: ['Question answering and translation.', 'Semantic similarity.', 'Foundation model embeddings.'],
      takeaways: ['Self-attention creates context-aware vectors.', 'Transformers are a core technology behind modern NLP.'],
      viz: ['token1 ↔ token2', 'token3 ↔ token7']
    }
  ];

  // --- Build concept cards ---
  let closeCurrentCard = null; // holds the close function of whichever card is currently open
  function renderConceptCards(){
    if(!grid || !template) return;

    const fragment = document.createDocumentFragment();
    grid.innerHTML = '';

    // Keep original order for each concept, but allow stable ordering via `order` if present.
    const ordered = concepts.slice().sort((a,b) => (a.order ?? 0) - (b.order ?? 0));
    ordered.forEach(c => {
      const node = template.content.firstElementChild.cloneNode(true);

      const iconEl = node.querySelector('.conceptCard__icon');
      const titleEl = node.querySelector('.conceptCard__title');
      const tagsEl = node.querySelector('.conceptCard__tags');
      const defEl = node.querySelector('.conceptCard__definition');

      if(iconEl) iconEl.textContent = c.icon || '🧩';
      if(titleEl) titleEl.textContent = c.title;
      if(tagsEl) tagsEl.textContent = c.category;
      if(defEl) defEl.textContent = c.definition;

      const purposes = node.querySelectorAll('.microText');
      // microText[0]=purpose, microText[1]=why
      if(purposes && purposes[0]) purposes[0].textContent = c.purpose;
      if(purposes && purposes[1]) purposes[1].textContent = c.why;

      const body = node.querySelector('.conceptCard__body');
      const expandBtn = node.querySelector('.conceptCard__expand');
      const chev = node.querySelector('.conceptCard__chev');

      node.dataset.search = [c.title, c.category, c.definition, c.purpose, c.why, c.workingPrinciple, c.steps.join(' '), c.example, c.advantages.join(' '), c.limitations.join(' '), c.applications.join(' ')].join(' | ');

      const w = node.querySelector('[data-field="workingPrinciple"]');
      if(w) w.textContent = c.workingPrinciple;

      const stepsOl = node.querySelector('[data-field="steps"]');
      if(stepsOl){
        stepsOl.innerHTML = '';
        c.steps.forEach(s => {
          const li = document.createElement('li');
          li.textContent = s;
          stepsOl.appendChild(li);
        });
      }

      const exampleBox = node.querySelector('[data-field="example"]');
      if(exampleBox){
        exampleBox.innerHTML = `<div class="muted" style="margin-bottom:.4rem; font-weight:850;">Example</div><div>${escapeHtml(c.example)}</div>`;
      }

      const advUl = node.querySelector('[data-field="advantages"]');
      if(advUl){
        advUl.innerHTML = '';
        c.advantages.forEach(a => { const li=document.createElement('li'); li.textContent=a; advUl.appendChild(li); });
      }

      const limUl = node.querySelector('[data-field="limitations"]');
      if(limUl){
        limUl.innerHTML = '';
        c.limitations.forEach(a => { const li=document.createElement('li'); li.textContent=a; limUl.appendChild(li); });
      }

      const appUl = node.querySelector('[data-field="applications"]');
      if(appUl){
        appUl.innerHTML = '';
        c.applications.forEach(a => { const li=document.createElement('li'); li.textContent=a; appUl.appendChild(li); });
      }

      const viz = node.querySelector('[data-field="viz"]');
      if(viz){
        viz.innerHTML = '';
        c.viz.forEach(t => {
          const s = document.createElement('span');
          s.textContent = t;
          viz.appendChild(s);
        });
      }

      const takeUl = node.querySelector('[data-field="takeaways"]');
      if(takeUl){
        takeUl.innerHTML='';
        c.takeaways.forEach(t => { const li=document.createElement('li'); li.textContent=t; takeUl.appendChild(li); });
      }

      // Expand/collapse (accordion: only one card open at a time)
      let open = false;
      const setOpen = (next) => {
        open = next;
        body.hidden = !open;
        if(chev) chev.textContent = open ? '▴' : '▾';
      };

      const openThisCard = () => {
        if(open){
          setOpen(false);
          closeCurrentCard = null;
          return;
        }
        if(closeCurrentCard) closeCurrentCard();
        setOpen(true);
        closeCurrentCard = () => setOpen(false);
      };

      expandBtn?.addEventListener('click', openThisCard);
      // Also toggle if user clicks the header (excluding the expand button)
      node.querySelector('.conceptCard__head')?.addEventListener('click', (e) => {
        if(e.target.closest('.conceptCard__expand')) return;
        openThisCard();
      });

      fragment.appendChild(node);
    });

    grid.appendChild(fragment);
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','<')
      .replaceAll('>','>')
      .replaceAll('"','"')
      .replaceAll("'",'&#039;');
  }

  // --- Workflows ---
  const workflowData = {
    preprocess: {
      descEl: 'preprocessDesc',
      steps: [
        {key:'input', label:'Input Text', hint:'Start with raw sentences.', desc:'Begin with unprocessed text from a document, chat log, or dataset.'},
        {key:'seg', label:'Sentence Segmentation', hint:'Split into sentence units.', desc:'Detect boundaries using punctuation and (when needed) language-specific cues.'},
        {key:'tok', label:'Tokenization', hint:'Create tokens.', desc:'Segment text into words/subwords/characters for consistent downstream processing.'},
        {key:'case', label:'Case Normalization', hint:'Make casing consistent.', desc:'Apply lowercase (or a controlled strategy) to reduce duplicate token forms.'},
        {key:'stop', label:'Stop-word Removal', hint:'Remove low-signal words.', desc:'Eliminate very frequent tokens that often add noise in classical representations.'},
        {key:'noise', label:'Noise Removal', hint:'Clean artifacts.', desc:'Remove URLs/markup, normalize repeated punctuation/characters, and reduce irrelevant clutter.'},
        {key:'clean', label:'Text Cleaning', hint:'Standardize text.', desc:'Normalize Unicode, whitespace, and punctuation for stable tokenization and feature counts.'},
        {key:'stemlem', label:'Stemming / Lemmatization', hint:'Reduce word forms.', desc:'Use heuristic stemming or more accurate lemmatization to group morphological variants.'},
        {key:'out', label:'Processed Text', hint:'Ready for features.', desc:'The final cleaned sequence supports vocabulary creation, TF/TF-IDF, or embedding encoders.'}
      ]
    },

    features: {
      descEl: 'featuresDesc',
      steps: [
        {key:'processed', label:'Processed Text', hint:'Use cleaned tokens.', desc:'Start from the output of the preprocessing pipeline.'},
        {key:'vocab', label:'Vocabulary Creation', hint:'Build token set.', desc:'Collect unique tokens/n-grams to define feature indices.'},
        {key:'bow', label:'Bag of Words', hint:'Count tokens.', desc:'Represent each document by token frequencies (order ignored).'},
        {key:'ngrams', label:'N-Grams', hint:'Add local order.', desc:'Generate contiguous token sequences to capture phrases.'},
        {key:'tf', label:'TF', hint:'Within-doc weight.', desc:'Compute term frequency to measure repetition in a document.'},
        {key:'idf', label:'IDF', hint:'Corpus rarity.', desc:'Compute inverse document frequency to downweight common terms.'},
        {key:'tfidf', label:'TF-IDF Matrix', hint:'Final features.', desc:'Multiply TF by IDF to obtain a weighted document-term matrix.'}
      ]
    },

    vector: {
      descEl: 'vectorDesc',
      steps: [
        {key:'raw', label:'Raw Text', hint:'Begin with text.', desc:'Raw text includes noise and inconsistencies before representation.'},
        {key:'clean', label:'Cleaning', hint:'Prepare input.', desc:'Remove artifacts and normalize formatting so representation is stable.'},
        {key:'vocab', label:'Vocabulary', hint:'Token set.', desc:'Create the vocabulary or define subword rules based on the encoder.'},
        {key:'encoding', label:'Encoding', hint:'Turn tokens into IDs.', desc:'Convert tokens to indices and prepare them for embedding layers.'},
        {key:'emb', label:'Word Embeddings', hint:'Dense vectors.', desc:'Map tokens into dense vectors that capture semantic relationships.'},
        {key:'vector', label:'Feature Vector', hint:'Fixed-size input.', desc:'Aggregate token vectors into a feature vector for prediction.'},
        {key:'model', label:'Machine Learning Model', hint:'Learn from vectors.', desc:'Train or apply a model for classification, retrieval, or ranking.'}
      ]
    }
  };

  function renderWorkflow(workflowKey, cardEl){
    const data = workflowData[workflowKey];
    if(!data) return;
    const nodesContainer = $('.workflow__nodes', cardEl);
    const descEl = document.getElementById(data.descEl);
    const panelStep = cardEl.querySelector('.workflow__panelStep');

    if(!nodesContainer) return;

    const frag = document.createDocumentFragment();

    data.steps.forEach((s, idx) => {
      const node = document.createElement('div');
      node.className = 'workflowNode';
      node.setAttribute('role', 'listitem');
      node.tabIndex = 0;
      node.dataset.stepKey = s.key;

      node.innerHTML = `
        <div style="display:flex; gap:.7rem; align-items:center;">
          <div class="workflowNode__dot" aria-hidden="true"></div>
          <div>
            <div class="workflowNode__label">${escapeHtml(s.label)}</div>
            <div class="workflowNode__hint">${escapeHtml(s.hint)}</div>
          </div>
        </div>
      `;

      const setActive = () => {
        $$('.workflowNode', cardEl).forEach(n => n.classList.remove('is-active'));
        node.classList.add('is-active');
        if(panelStep) panelStep.textContent = s.label;
        if(descEl) descEl.textContent = s.desc;
      };

      node.addEventListener('click', setActive);
      node.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          setActive();
        }
      });

      node.addEventListener('pointerenter', (e) => {
        // Show tooltip on hover
        const t = window.__NLP_TOOLTIP__;
        if(t){
          t.showTooltip(s.desc, e.clientX, e.clientY);
        }
      });
      node.addEventListener('pointerleave', () => {
        const t = window.__NLP_TOOLTIP__;
        t?.hideTooltip();
      });

      frag.appendChild(node);

      if(idx < data.steps.length - 1){
        const connector = document.createElement('div');
        connector.className = 'workflowConnector';
        connector.setAttribute('aria-hidden', 'true');
        connector.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3 V19 M12 19 L6 13 M12 19 L18 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        frag.appendChild(connector);
      }
    });

    nodesContainer.innerHTML='';
    nodesContainer.appendChild(frag);

    // Activate first by default
    const first = nodesContainer.querySelector('.workflowNode');
    if(first){ first.click(); }
  }

  function initWorkflows(){
    const cards = $$('[data-workflow]');
    cards.forEach(card => {
      const key = card.getAttribute('data-workflow');
      renderWorkflow(key, card);
    });
  }

  renderConceptCards();
  initWorkflows();
})();

