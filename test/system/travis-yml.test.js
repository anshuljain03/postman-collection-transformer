/* global describe, it */
var fs = require('fs'),
    yaml = require('js-yaml'),
    expect = require('chai').expect;

describe('travis.yml', function () {
    var travisYAML,
        travisYAMLError;

    try {
        travisYAML = yaml.safeLoad(fs.readFileSync('.travis.yml').toString());
    }
    catch (e) {
        travisYAMLError = e;
    }

    it('should exist', function (done) {
        fs.stat('.travis.yml', done);
    });

    it('should be a valid yml', function () {
        expect(travisYAMLError && travisYAMLError.message || travisYAMLError).to.not.be.ok;
    });

    describe('strucure', function () {
        it('should use the trusty Ubuntu distribution', function () {
            expect(travisYAML.dist).to.equal('trusty');
        });

        it('should have the language set to node', function () {
            expect(travisYAML.language).to.equal('node_js');
            expect(travisYAML.node_js).to.eql(['4', '6', '8']);
        });

        it('should use the stable google chrome package', function () {
            expect(travisYAML.addons).to.eql({ apt: { packages: ['google-chrome-stable'] } });
        });

        it('should have a valid before_install sequence', function () {
            expect(travisYAML.before_install).to.eql([
                'export CHROME_BIN=google-chrome', 'export DISPLAY=:99.0', 'sh -e /etc/init.d/xvfb start', 'sleep 3'
            ]);
        });

        it('should have a valid Slack notification token', function () {
            expect(travisYAML.notifications.slack.secure).to.be.ok;
        });
    });
});
