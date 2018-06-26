yaml = require('js-yaml');
fs   = require('fs');

exports.CfgError =  class CfgError extends Error{}

function cfgYml(configFile, searchParams = {}, ) {
    try {
        let configFileExt = configFile + '.yml';

        if (!fs.existsSync(configFileExt)) {
            configFileExt = configFile + '.yaml'
            if (!fs.existsSync(configFileExt)){
                throw new CfgError('file not exist')
            }
        }

        var doc = yaml.safeLoad(fs.readFileSync(configFileExt, 'utf8'));
        let searchParamsLength = Object.keys(searchParams).length;
        if (doc['links'] && searchParamsLength > 0) {
            for (let link of doc.links) {
                if (!link['k'] || !link['v']) {
                    continue;
                }

                let leng = Object.keys(link['k']).length;
                if (leng != searchParamsLength) {
                    continue;
                }
                let eqlCounter = 0;
                for (let key in link['k']) {
                    if(Object.keys(searchParams).indexOf(key) == -1) {
                        break;
                    }

                    if(Array.isArray(link['k'][key])) {
                        if(link['k'][key].indexOf(searchParams[key]) == -1) {
                            break;
                        };
                        eqlCounter ++;
                    } else {
                        if (link['k'][key] != searchParams[key]) {
                            break;
                        }
                        eqlCounter ++;
                    }
                }

                if (eqlCounter == searchParamsLength) {
                    return link['v'];
                }
          }
        }

        if (doc['def']) {
            return doc['def']
        } else {
            return false;
        }
    } catch (e) {
        throw new CfgError(e);
    }
}

exports.default = cfgYml
