export var ParseModel = (function () {
    function ParseModel() {
        this.config = {
            appName: "schild-besafe",
            serverURL: "https://besafe-parse.herokuapp.com/parse",
            masterKey: "schild#besafe"
        };
    }
    ParseModel.prototype.getParse = function () {
        var Parse = require('parse');
        Parse.initialize(this.config.appName, 'unused'); //,,'unused'
        Parse.masterKey = this.config.masterKey;
        Parse.serverURL = this.config.serverURL;
        return Parse;
    };
    return ParseModel;
}());
//# sourceMappingURL=parse-model.js.map