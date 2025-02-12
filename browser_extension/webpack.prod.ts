/* 
    Use case: Use this configuration 
    when getting ready to deploy the 
    password manager to a live environment 
    or share it with others. This build 
    ensures that the app is faster, more 
    secure, and optimized for end users.
*/

import {Configuration} from 'webpack'
import {merge} from 'webpack-merge'
import config from './webpack.common'

const merged = merge<Configuration>(config,{
    mode: 'production',
    devtool: 'source-map',
})

export default merged
