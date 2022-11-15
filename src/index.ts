import * as tf from '@tensorflow/tfjs';
import TextVectorization from './utils/TextVectorization';

const labels = ['greeting', 'ask']

const dataset = [
    {
        text: 'Halo selamat pagi',
        label: 'greeting'
    },
    {
        text: 'Selamat siang',
        label: 'greeting'
    },
    {
        text: 'Hai min',
        label: 'greeting'
    },
    {
        text: 'Berapa harga produk ini min?',
        label: 'ask'
    },
    {
        text: 'Stocknya ada?',
        label: 'ask'
    },
]

const testDataset = [
    'selamat sore min'
]


const datasetTextOnly = dataset.map(d => d.text)

const maxSequenceLength = 10

const tv = new TextVectorization({ maxSequenceLength })
tv.adapt(datasetTextOnly)

const trainData = datasetTextOnly.map(t => tv.vectorize(t))
const trainOutput = dataset.map(t => t.label == labels[0] ? [1, 0] : [0, 1])
const testData = testDataset.map(t => tv.vectorize(t))

// console.log(trainData, trainOutput)

// Define a model for text classification
const model = tf.sequential();
model.add(tf.layers.dense({ units: 10, inputShape: [maxSequenceLength], activation: "sigmoid" }));
model.add(tf.layers.dense({ units: 2, activation: "sigmoid" }));

model.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(.06) });


// Generate some synthetic data for training.
const xs = tf.tensor(trainData);
const ys = tf.tensor(trainOutput);

// Train the model using the data.
model.fit(xs, ys, { epochs: 100 }).then(() => {
    (model.predict(tf.tensor(testData)) as tf.Tensor).print();
});
