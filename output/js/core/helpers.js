define(["jointjs", "lodash", "jquery"], function(joint, _, $){

  var elementChangeHandler = function(event){
    var eventObject = that.objects.findWhere({graphId: event.get("id")});
    var key = that.schema.package.toLowerCase()+"#"+eventObject.get("name").toLowerCase();
    var position = eventObject.get("data").position;
    if(eventObject.get("data").position == null){
      eventObject.get("data").position = {};
      var position = eventObject.get("data").position;
    }
    // Store preferences.
    var syncSet = {};
    console.log("key -> "+key+"\nObject -> "+JSON.stringify(event.toJSON()));
    syncSet[key] = event.toJSON();
    chrome.storage.local.set(syncSet);
  }
  var renderObject = {
    "View": function(graph, object, position, objectAttr){
      if(objectAttr == null){
        objectAttr = {
          position: position,
          size: { width: object.get("name").length*12, height: 30 },
          attrs: { 
            id: object.get("name"), 
            rect: { fill: 'rgb(169,209,142)', stroke: "rgb(0,176,80)", "stroke-width": 1, "stroke-dasharray": "3,3" },
            text: { text: object.get("name"), fill: 'black'} 
          } 
        }
      }
      // console.log("objectAttr --> "+objectAttr+"\n");
      var t = new joint.shapes.basic.Rect(objectAttr);
      t.on('change:position', _.debounce(elementChangeHandler, 500, { 'maxWait' : 1000 }));
      // t.translate((position+1)*110, (position+1)*30);
      object.set({graphId: t.id})
      graph.addCell(t);
    },
    "Object": function(graph, object, position, objectAttr){
      if(objectAttr == null){
        if(object.get("inSchema")){
          // , "stroke-dasharray": "3,3"  },
          objectAttr = {
            position: position,
            size: { width: object.get("name").length*12, height: 30 },
            attrs: { 
              id: object.get("name"), 
              rect: { fill: 'rgb(46,117,182)', stroke: "rgb(65,113,156)", "stroke-width": 2 },
              text: { text: object.get("name"), fill: 'white'} 
            } 
          }
        } else {
          objectAttr = {
            position: position,
            size: { width: object.get("name").length*12, height: 30 },
            attrs: { 
              id: object.get("name"), 
              rect: { fill: 'rgb(166,201,232)', stroke: "white", "stroke-width": 0  },
              text: { text: object.get("name"), fill: 'white'} 
            } 
          }
        }            
      }
      // console.log("objectAttr --> "+objectAttr+"\n");
      var t = new joint.shapes.basic.Rect(objectAttr);
      t.on('change:position', _.debounce(elementChangeHandler, 500, { 'maxWait' : 1000 }));
      object.set({graphId: t.id})
      graph.addCell(t);
    },
    "Enumeration": function(graph, object, position, objectAttr){
      if(objectAttr == null){
        objectAttr = {
          position: position,
          size: { width: object.get("name").length*12, height: 30 },
          attrs: { 
            id: object.get("name"), 
            rect: { fill: 'rgb(251,229,214)', stroke: "rgb(248,203,173)", "stroke-width": 1  },
            text: { text: object.get("name"), fill: 'black'} 
          } 
        }
      }
      // console.log("objectAttr --> "+objectAttr+"\n");
      var t = new joint.shapes.basic.Rect(objectAttr);
      t.on('change:position', _.debounce(elementChangeHandler, 500, { 'maxWait' : 1000 }));
      object.set({graphId: t.id})
      graph.addCell(t);
    },
    "Mapper": function(graph, object, position, objectAttr){
      if(objectAttr == null){
        objectAttr = {
          position: position,
          size: { width: object.get("name").length*12, height: 30 },
          attrs: { 
            id: object.get("name"), 
            rect: { fill: 'rgb(248,203,173)', stroke: "rgb(244,177,131)", "stroke-width": 2  },
            text: { text: object.get("name"), fill: 'black'} 
          } 
        }           
      }
      var t = new joint.shapes.basic.Rect(objectAttr);
      t.on('change:position', _.debounce(elementChangeHandler, 
        500, { 'maxWait' : 1000 })
      );
      object.set({graphId: t.id})
      graph.addCell(t);
    }
  };
  return { renderObject: renderObject };
})