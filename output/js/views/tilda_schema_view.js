define(['text!../templates/tilda_schema/_new.html', "../core/parser"], function(_NewView, _Parser){
  var Backbone = require('backbone');
  var _ = require('lodash');
  var promiseError = function(error, reject){
    console.error(error.message);
    console.error(error.stack);
    reject(error)
  }
  var TildaSchemaView = Backbone.View.extend({
    schemaName: null,
    events: {
      'click a[name="schema-file"]': 'handleFileInput',
      'click .saveSchema': 'saveSchema',
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
    schemaFrom: function(fileName, entry){
      var p = new Promise(function (resolve, reject) {
        var readFile = function(_file){
          var reader = new FileReader();
          reader.onload = function(event) {
            try{
              var schema = JSON.parse(event.target.result);
              resolve(schema)
            } catch(e){
              console.error("Error occured -> "+e.message);
              console.error(e.stack);
              reject(e);
            }
          };
          reader.readAsText(_file);
        }
        entry.getFile(fileName, {create: false}, function(fileEntry){
          fileEntry.file(function(file){
            readFile(file);
          })
        }, function(error){
          promiseError(error, reject)
        })
      })
      return p;
    },
    initCache: function(fileName, entry){
      var p = new Promise(function (resolve, reject) {
        var readFile = function(_file){
          var reader = new FileReader();
          reader.onload = function(event) {
            try{
              var tildaCache = JSON.parse(event.target.result).tildaCache || {};
              resolve(tildaCache)
            } catch(e){
              resolve({})
            }
          };
          reader.readAsText(_file);
        }
        entry.getFile(fileName, {create: false}, function(fileEntry){
          fileEntry.file(function(file){
            readFile(file);
          })
        }, function(error){
          resolve({});
          // promiseError(error, reject)
        })
      })
      return p;
    },
    initPackageInfo: function(entry){
      var p = new Promise(function (resolve, reject) {
        var readFile = function(_file){
          var reader = new FileReader();
          reader.onload = function(event) {
            try{
              var packageInfo = JSON.parse(event.target.result) || {};
              resolve(packageInfo)
            } catch(e){
              reject(e);
            }
          };
          reader.readAsText(_file);
        }
        entry.getFile("_tilda.packageInfo.json", {create: false}, function(fileEntry){
          fileEntry.file(function(file){
            readFile(file);
          })
        }, function(error){
          promiseError(error, reject)
        })
      })
      return p;
    },
    handleFileInput: function(event){
      var that = this;
      var error = function(error){
        console.log(error.message);
        console.log(error.stack);
      }
      var init = function(entry){
        var p = that.initPackageInfo(entry)
        p.then(function(pkgInfo){
          var cacheName = "_tilda."+pkgInfo.schema.name+".graph.json";
          that.initCache(cacheName, entry).then(function(cache){
            window.tildaCache = cache;
            var schemaFname = "_tilda."+pkgInfo.schema.name+".json";
            that.schemaFrom(schemaFname, entry).then(function(schema){
              that.schemaParser_object = new _Parser(_.clone(schema), "obj_c", {viewOnly: false});
              that.schemaParser_view = new _Parser(_.clone(schema), "view_c", {viewOnly: true});
            }).catch(error);
          }).catch(error);
        })
        p.catch(error);
      }
      chrome.fileSystem.chooseEntry({ type: 'openDirectory'},  function(entry, fileEntries) {
        init(entry);
      });
      return 0;
    },
    saveSchema: function(event){
      // TODO write to a file.
      var objSVG = this.schemaParser_object.paper.$el.find("svg")[0]

      var viewSVG = this.schemaParser_view.paper.$el.find("svg")[0];
      var that = this;
      $.get('css/joint.css', function(css){
        chrome.fileSystem.chooseEntry( {
          type: 'saveFile',
          acceptsAllTypes: true
        }, function(fileEntry){
          fileEntry.createWriter(function(fileWriter) {
            var truncated = false;
            var script = "\n\
              <script>\n\
                window.onload = function(){\n\
                  debugger;\n\
                  var svgs = document.getElementsByTagName('svg');\n\
                  for(i=0;i<svgs.length;i++){\n\
                    var svg = svgs[i];\n\
                    var bbox = svg.getBBox();\n\
                    svg.setAttribute('viewBox', [bbox.x, bbox.y, bbox.width, bbox.height]);\n\
                    svg.width.baseVal.valueAsString = bbox.width;\n\
                    svg.height.baseVal.valueAsString = bbox.height;\n\
                  }\n\
                }\n\
              </script>";
            var blob = new Blob(["<style>"+css+"</style>", "<div class='container'>"
              +objSVG.parentElement.innerHTML,"</div>", "<br/>"
              ,"<div class='container'>", viewSVG.parentElement.innerHTML,"</div>"
              , script], {type: "image/svg"});
            fileWriter.onwriteend = function(e) {
              if (!truncated) {
                truncated = true;
                // You need to explicitly set the file size to truncate
                // any content that might have been there before
                this.truncate(blob.size);
                return;
              }
              console.log('Export to '+fileDisplayPath+' completed');
            };
            fileWriter.onerror = function(e) {
              console.error('Export failed: '+e.toString());
            };
            fileWriter.write(blob);
          });
        });        
      })


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