export class ParseModel
{
    config : any;
    constructor()
    {

      this.config = {
         appName: "schild-besafe",
         serverURL: "https://besafe-parse.herokuapp.com/parse",
         masterKey: "schild#besafe"
      };



    }

    getParse()
    {
      var Parse = require('parse');
      Parse.initialize(this.config.appName, 'unused');  //,,'unused'
      Parse.masterKey =  this.config.masterKey;
      Parse.serverURL = this.config.serverURL;
      return Parse;
    }
}
