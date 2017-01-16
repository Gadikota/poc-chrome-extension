define(["jointjs", "lodash", "jquery"], function(joint, _, $){
  var gotoNextPosition = function(currentPos){
    if(currentPos.x+200 > window.screen.availWidth){
      currentPos.x = 100;
      currentPos.y = currentPos.y+200;
    } else{
      currentPos.x = currentPos.x+200;
    }
    return currentPos;
  }

  var renderObject = {
    "View": function(graph, object, position, objectAttr, package){
      if(objectAttr == null){
        var name = object.get("schemaName")+"."+object.get("name");
        objectAttr = {
          position: gotoNextPosition(position),
          size: { width: name.length*12, height: 30 },
          attrs: { 
            rect: { fill: 'rgb(169,209,142)', stroke: "rgb(0,176,80)", "stroke-width": 1, "stroke-dasharray": "3,3" },
            text: { text: name, fill: 'black'} 
          } 
        }
      }

      var t = new joint.shapes.basic.Rect(objectAttr);
      graph.addCell(t);
      object.set({graphId: t.id, rendered: true})

      // dependencies;
      var references = object.get("references") || [];
      _.each(references, function(value, i){
        var key = package+value.get("friendlyName");
        objectAttr = window.tildaCache[key];
        if(objectAttr == null){
          var refName = value.get("schemaName")+"."+value.get("name");
          objectAttr = {
            position: gotoNextPosition(position),
            size: { width: refName.length*12, height: 30 },
            attrs: { 
              rect: { fill: 'rgb(169,209,142)', stroke: "rgb(0,176,80)", "stroke-width": 1, "stroke-dasharray": "3,3" },
              text: { text: refName, fill: 'black'}
            } 
          }
        }
        if(value.get('rendered') == null){ 
          var t = new joint.shapes.basic.Rect(objectAttr);
          graph.addCell(t);
          value.set({graphId: t.id, rendered: true})
        }
      })
      return t;
    },
    "Object": function(graph, object, position, objectAttr, package){
      if(objectAttr == null){
        // , "stroke-dasharray": "3,3"  },
        var name = object.get("schemaName")+"."+object.get("name");
        objectAttr = {
          position: position,
          size: { width: name.length*12, height: 30 },
          attrs: {
            id: object.get("friendlyName"),
            rect: { fill: 'rgb(46,117,182)', stroke: "rgb(65,113,156)", "stroke-width": 2 },
            text: { text: name, fill: 'white'}
          } 
        }
      }
      console.log("Name -> "+name);
      var t = new joint.shapes.basic.Rect(objectAttr);
      graph.addCell(t);
      t.set({graphId: t.id, rendered: true})
      // dependencies;
      var references = object.get("references") || [];
      _.each(references, function(value, i){
        var key = package+value.get("friendlyName");
        objectAttr = window.tildaCache[key];
        var refName = value.get("schemaName")+"."+value.get("name");
        console.log("refName -> "+refName);
        if(objectAttr == null){
          objectAttr = {
            position: gotoNextPosition(position),
            size: { width: refName.length*12, height: 30 },
            attrs: {
              id: value.get("friendlyName"),
              rect: { fill: 'rgb(46,117,182)', stroke: "rgb(65,113,156)", "stroke-width": 2 },
              text: { text: refName, fill: 'white'}
            } 
          }
        }
        if(value.get('rendered') == null){
          var t1 = new joint.shapes.basic.Rect(objectAttr);
          graph.addCell(t1);
          value.set({graphId: t1.id, rendered: true})
        }
      })
      return t;
    },
    "Enumeration": function(graph, object, position, objectAttr, package){
      var name = object.get("schemaName")+"."+object.get("name");
      if(objectAttr == null){
        objectAttr = {
          position: position,
          size: { width: name.length*12, height: 30 },
          attrs: { 
            id: object.get("friendlyName"),
            rect: { fill: 'rgb(251,229,214)', stroke: "rgb(248,203,173)", "stroke-width": 1  },
            text: { text: name, fill: 'black'} 
          } 
        }

      }
      var t = new joint.shapes.basic.Rect(objectAttr);
      graph.addCell(t);
      t.set({graphId: t.id, rendered: true})
      // dependencies;
      var references = object.get("references") || [];
      _.each(references, function(value, i){
        var key = package+value.get("friendlyName");
        objectAttr = window.tildaCache[key];
        var refName = value.get("schemaName")+"."+value.get("name");
        console.log("refName -> "+refName);
        if(objectAttr == null){
          objectAttr = {
            position: gotoNextPosition(position),
            size: { width: refName.length*12, height: 30 },
            attrs: {
              id: value.get("friendlyName"),
              rect: { fill: 'rgb(251,229,214)', stroke: "rgb(248,203,173)", "stroke-width": 1  },
              text: { text: refName, fill: 'black'}
            } 
          }
        }
        if(value.get('rendered') == null){
          var t1 = new joint.shapes.basic.Rect(objectAttr);
          graph.addCell(t1);
          value.set({graphId: t1.id, rendered: true})
        }
      })
      return t;

    },
    "Mapper": function(graph, object, position, objectAttr, package){
      if(objectAttr == null){
        var name = object.get("schemaName")+"."+object.get("name");
        objectAttr = {
          position: position,
          size: { width: name.length*12, height: 30 },
          attrs: { 
            id: object.get("friendlyName"),
            rect: { fill: 'rgb(248,203,173)', stroke: "rgb(244,177,131)", "stroke-width": 2  },
            text: { text: name, fill: 'black'} 
          } 
        }           
      }
      var t = new joint.shapes.basic.Rect(objectAttr);
      graph.addCell(t);
      // dependencies;
      var references = object.get("references") || [];
      _.each(references, function(value, i){
        var key = package+value.get("friendlyName");
        objectAttr = window.tildaCache[key];
        var refName = value.get("schemaName")+"."+value.get("name");
        console.log("refName -> "+refName);
        if(objectAttr == null){
          objectAttr = {
            position: gotoNextPosition(position),
            size: { width: refName.length*12, height: 30 },
            attrs: {
              id: value.get("friendlyName"),
              rect: { fill: 'rgb(248,203,173)', stroke: "rgb(244,177,131)", "stroke-width": 2  },
              text: { text: refName, fill: 'black'}
            } 
          }
        }
        if(value.get('rendered') == null){
          var t1 = new joint.shapes.basic.Rect(objectAttr);
          graph.addCell(t1);
          value.set({graphId: t1.id, rendered: true})
        }
      })

      return t;
    }
  };
  return { renderObject: renderObject };
})