//Clusters controller

import '@babel/polyfill/noConflict'

import cluster from 'cluster'
import os from 'os'
import dotenv from 'dotenv'

if (cluster.isMaster) {
    dotenv.config()

    const cpusCount =
        process.env.NODE_ENV === 'production' ? os.cpus().length : 1
    const maxClusters = process.env.CLUSTER_MAX || cpusCount

    for (let i = 0; i < maxClusters; i++) cluster.fork()

    cluster.on('exit', (deadWorker, code, signal) => {
        setTimeout(() => {
            cluster.fork()
        }, 3000)
    })
} else {
    require('./app.js')
}
