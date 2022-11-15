interface Config {
    maxSequenceLength: number
}

export default class TextVectorization {
    words: Set<string>;
    maxSequenceLength: number;

    /**
     * 
     * @param config
     * maxSequenceLength : max words in sentences
     */
    constructor(config: Config) {
        this.words = new Set<string>();
        this.maxSequenceLength = config.maxSequenceLength;
    }

    adapt(data: Array<string>) {
        for (const t of data) {
            const textsSanitized = t.toLowerCase().split(' ').map((i) => i.replace(/\W_/g, ''))
            for (const w of textsSanitized) {
                this.words.add(w)
            }
        }
    }

    vectorize(text: string) {
        const textsSanitized = text.toLowerCase().split(' ').map((i) => i.replace(/\W_/g, ''))
        // convert to array
        const words = Array.from(this.words)
        // word to indexed number
        const wordsSanitized = textsSanitized.map((w) => words.indexOf(w))

        if (wordsSanitized.length <= this.maxSequenceLength) {
            // fill zero to fit max sequence length
            return wordsSanitized.concat(Array(this.maxSequenceLength - wordsSanitized.length).fill(0))
        } else {
            // trim to max sequence length
            return wordsSanitized.slice(0, this.maxSequenceLength)
        }
    }
}