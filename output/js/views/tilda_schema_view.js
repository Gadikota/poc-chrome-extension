define(['text!../templates/tilda_schema/_new.html', "../core/parser"], function(_NewView, _Parser){
  var Backbone = require('backbone');
  var _ = require('lodash');
  var TildaSchemaView = Backbone.View.extend({
    events: {
      'change input[type=file][name="schema-file"]': 'handleFileInput',
      'click .saveSchema': 'saveSchema',
      'click .reset': 'resetView',
      'change input:radio[name="showObj"]': "togglePapers"
    },
    togglePapers: function(){
      if($(event.target).val() == "object"){
        this.$el.find("#view_c").hide(); // hide for now.
        this.$el.find("#obj_c").show();
      } else{
        this.$el.find("#obj_c").hide(); // hide for now.
        this.$el.find("#view_c").show();
      }
    },
    render: function(){
      var that = this;
      that.$el.html(_NewView);
      return this;
    },
    handleFileInput: function(event){
      var that = this;
      var file = $(event.target)[0].files[0]; // only one file at a time.


      $("#obj_c").remove()
      var p = document.createElement("div");
      p.id = "obj_c";
      this.$el.append($(p));
      this.schemaParser_view = new _Parser(file, "obj_c", {viewOnly: false});
      setTimeout(function(){
        $("#view_c").remove();
        var p2 = document.createElement("div");
        p2.id = "view_c";
        that.$el.append($(p2));
        that.schemaParser_object = new _Parser(file, "view_c", {viewOnly: true});

        that.$el.find("#view_c").hide(); // hide for now.        
      }, 10000);

    },
    saveSchema: function(event){
      // TODO write to a file.
    },
    resetView: function(event){
      if(this.schemaParser_object){
        this.schemaParser_object.resetAll();
      }
      if(this.schemaParser_view){
        this.schemaParser_view.resetAll();
      }
    }
  })
  return TildaSchemaView;
})