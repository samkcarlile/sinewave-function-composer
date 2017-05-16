var app = new Vue({
  el: "#app",
  data: {
    inNote: "",
    inFreq: "",
    inDur: "",
    notes: []
  },
  created: function () {
    this.loadStorage();
  },
  methods: {
    addNote: function () {
      if (this.inNote.length < 1 || this.inFreq.length < 1 || this.inDur.length < 1) {
        return;
      }
      // make sure it's valid.
      
      var newNote = {
        val: this.inNote.toLowerCase(),
        freq: parseFloat(this.inFreq),
        duration: this.inDur
      };

      this.inNote = "";
      this.inFreq = "";
      this.inDur = "";

      this.notes.push(newNote);
      this.saveStorage();
    },
    removeNote: function (index) {
      this.notes.splice(index,1);
      this.saveStorage();
    },
    moveUp: function(index) {
      if (index === 0) {
        return;
      }
      var note = this.notes[index];
      var prevNote = this.notes[index - 1];
      Vue.set(this.notes, index - 1, note);
      Vue.set(this.notes, index, prevNote);
    },
    moveDown: function (index) {
      if (index === this.notes.length - 1) {
        return;
      }
      var note = this.notes[index];
      var nextNote = this.notes[index + 1];
      Vue.set(this.notes, index + 1, note);
      Vue.set(this.notes, index, nextNote);
    },
    clearAll: function () {
      var ok = confirm("Are you sure you want to clear the table?")
      if (ok) {
        this.notes = [];
      }
      this.saveStorage();
    },
    saveStorage: function () {
      window.localStorage['savedTable'] = JSON.stringify(this.notes);
    },
    loadStorage: function () {
      var data = window.localStorage['savedTable'];
      if (window.localStorage['savedTable'] !== undefined) {
        try {
          this.notes = JSON.parse(data);
        } catch (e) {
          this.notes = [];
        }
      }
    },
    downloadTable: function () {
      //make csv string
      var data = "note,frequency,equation,duration\n";
      for (var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        data += note.val + "," + note.freq + ",f(x)=" + getFunctionString(note) + "," + "\"" + note.duration + "\"\n";
      }

      var blob = new Blob([data], {type: 'text/csv'});
      if(window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, "table.csv");
      }
      else{
          var elem = window.document.createElement('a');
          elem.href = window.URL.createObjectURL(blob);
          elem.download = "table.csv";        
          document.body.appendChild(elem);
          elem.click();
          window.URL.revokeObjectURL(elem.href);
          document.body.removeChild(elem);
      }
    }
  },
  computed: {
    geoFunc: function () {
      if (this.notes.length <= 0) {
        return "function will appear here once you add notes to the table";
      }
      var res = "f(x) = If[";
      for (var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        var durVals = note.duration.replace("(","").replace(")","").split(",");
        res += durVals[0] + "<x<" + durVals[1] + ",";
        res += getFunctionString(note) + ",";
      }
      res = res.substring(0, res.length - 1);
      res += "]";
      return res;
    },
    CSVString: function () {
      var str = "note,frequency,equation,duration\n";
      for (var i = 0;i < this.notes.length; i++) {
        var note = this.notes[i];
        str += note.val + "," + note.freq + ",f(x)=" + getFunctionString(note) + ",\"" + note.duration + "\"\n";
      }
      return str;
    },
    emailURL: function () {
      return encodeURI("mailto:?subject=My Sinewave Function&body=Function:\n" + this.geoFunc + "\n\nTable:\n" + this.CSVString);
    }
  }
});


function getFunctionString(note) {
  return "2*sin(" + note.freq*2 + "*pi*x)";
}