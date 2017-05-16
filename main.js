var app = new Vue({
  el: "#app",
  data: {
    inNote: "",
    inFreq: "",
    inDur: "",
    notes: []
  },
  methods: {
    addNote: function () {
      if (this.inNote.length < 1 || this.inFreq.length < 1 || this.inDur.length < 1) {
        return;
      }
      var newNote = {
        val: this.inNote,
        freq: parseFloat(this.inFreq),
        duration: this.inDur
      };

      this.inNote = "";
      this.inFreq = "";
      this.inDur = "";

      this.notes.push(newNote);
    },
    removeNote: function (index) {
      this.notes.splice(index,1);
    },
    clearAll: function () {
      var ok = confirm("Are you sure you want to clear the table?")
      if (ok) {
        this.notes = [];
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
    }
  }
});

getFunctionString = function (note) {
  return "2*sin(" + note.freq*2 + "*pi*x)";
}