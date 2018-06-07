define(["jointjs", "lodash", "jquery"], function(joint, _, $){
  var gotoNextPosition = function(currentPos){
    if(currentPos.x+200 > window.screen.availWidth){
      currentPos.x = 100;
      currentPos.y = currentPos.y+200;
    } else{
      currentPos.y = 100;
      currentPos.x = currentPos.x+200;
    }
    return currentPos;
  }
  var X = {};

  var renderView = function(graph, object, position, objectAttr, package, elementChangeHandler){
    var renderFn = function(g, o, p, attr, pkg){
      if(attr == null){
        var name = o.get("schemaName")+"."+o.get("name");
        attr = {
          size: { width: name.length*12+(name.length <=7 ? 20 : 0 ), height: 30 },
          attrs: { 
            rect: { fill: 'rgb(169,209,142)', stroke: "rgb(0,176,80)", "stroke-width": 1, "stroke-dasharray": "3,3" },
            text: { text: name, fill: 'black'} 
          }
        }
        // if(graph.get("docket_view") != true)
        // {
        //   attr["hidden"] = true;
        // }
      }
      if(p != null)
      {
        attr["position"] = p;
      }
      if(o.get('graphId') == null){
        var t = new joint.shapes.basic.CustomRect(attr);
        o.set({graphId: t.id, rendered: true, package: package})
        if(t.get('hidden') == true)
        {
          t.set({customId: o.get("friendlyName")});
          g.trigger('remove', {model: t})
          return null;
        }
        else
        {
          t.set({customId: o.get("friendlyName")});
          g.addCell(t);
        }
      }
      return t;
    }
    var a = renderFn.apply(this, arguments);

    if(a)
    {
      a.on('change:position', _.debounce(elementChangeHandler, 500, { 'maxWait' : 1000 }));
//       console.log("customId -> "+a.get('customId'));
    }

    var references = object.get("references") || [];
    _.each(references, function(value, i){
      var key = package+"#"+value.get("friendlyName");
      objectAttr = window.tildaCache[key];
      var fn = X[value.get("_type")];
      var  t = fn.apply(this, [graph, value, gotoNextPosition(position), objectAttr, package, elementChangeHandler])
      if(t != null)
      {
        console.log("customId -> "+ t.get('customId'));        
      }
    })
    return a;
  }
  var renderObject = function(graph, object, position, objectAttr, package, elementChangeHandler){
    var renderFn = function(g, o, p, attr, pkg){
      var name = o.get("schemaName")+"."+o.get("name");
      if(attr == null){
        // , "stroke-dasharray": "3,3"  },
        attr = {
          size: { width: name.length*12+(name.length <=7 ? 20 : 0 ), height: 30 },
          attrs: {
            text: { text: name, fill: 'white'}
          }
        }
        if(p != null)
        {
          attr["position"] = p;
        }
        if(o.get("inSchema"))
        {
          attr["attrs"]["rect"] = { fill: 'rgb(46,117,182)', stroke: "rgb(65,113,156)", "stroke-width": 2 }
        }
        else
        {
          attr["attrs"]["rect"] = { fill: 'rgb(166,201,232)', stroke: "white", "stroke-width": 0  }
        }
        // if(graph.get("docket_view") != true)
        // {
        //   attr["hidden"] = true;
        // }
      }
      // attr.model = new joint.shapes.devs.Model(attr).clone()
      if(o.get('graphId') == null){
        var t = new joint.shapes.basic.CustomRect(attr);
        o.set({graphId: t.id, rendered: true, package: package})
        if(t.get('hidden') == true)
        {
          t.set({customId: o.get("friendlyName")});
          g.trigger('remove', {model: t})
          return null;
        }
        else
        {
          t.set({customId: o.get("friendlyName")});
          g.addCell(t);
        }
      }
      return t;
    }
    var a = renderFn.apply(this, arguments);
    if(a)
    {
      a.on('change:position', _.debounce(elementChangeHandler, 500, { 'maxWait' : 1000 }));      
      // console.log("customId -> "+a.get('customId'));
    }
    var references = object.get("references") || [];
    _.each(references, function(value, i){
      var key = package+"#"+value.get("friendlyName");
      objectAttr = window.tildaCache[key];
      var fn = X[value.get("_type")];
      var t = fn.apply(this, [graph, value, gotoNextPosition(position), objectAttr, package, elementChangeHandler])
      if(t != null)
      {
        console.log("customId -> "+ t.get('customId'));        
      }
    })
    return a;
  }
  var renderEnumeration = function(graph, object, position, objectAttr, package, elementChangeHandler){
    var renderFn = function(g, o, p, attr, pkg){
      if(attr == null){
        var name = o.get("schemaName")+"."+o.get("name");
        attr = {
          position: p,
          size: { width: name.length*12+(name.length <=7 ? 20 : 0 ), height: 30 },
          attrs: { 
              rect: { fill: 'rgb(251,229,214)', stroke: "rgb(248,203,173)", "stroke-width": 1  },
            text: { text: name, fill: 'black'} 
          } 
        }
        // if(graph.get("docket_view") != true)
        // {
        //   attr["hidden"] = true;
        // }
      }
      if(p != null)
      {
        attr["position"] = p;
      }
      // attr.model = new joint.shapes.devs.Model(attr).clone()
      if(o.get('graphId') == null){
        var t = new joint.shapes.basic.CustomRect(attr);
        o.set({graphId: t.id, rendered: true, package: package})
        if(t.get('hidden') == true)
        {
          t.set({customId: o.get("friendlyName")});
          g.trigger('remove', {model: t})
          return null;
        }
        else
        {
          t.set({customId: o.get("friendlyName")});
          g.addCell(t);
        }
      }
      return t;
    }
    var a = renderFn.apply(this, arguments);
    
    if(a)
    {
      a.on('change:position', _.debounce(elementChangeHandler, 500, { 'maxWait' : 1000 }));      
      // console.log("customId -> "+a.get('customId'));
    }
    var references = object.get("references") || [];
    _.each(references, function(value, i){
      var key = package+"#"+value.get("friendlyName");
      objectAttr = window.tildaCache[key];
      var fn = X[value.get("_type")];
      var t  = fn.apply(this, [graph, value, gotoNextPosition(position), objectAttr, package, elementChangeHandler])
      if(t != null)
      {
        console.log("customId -> "+ t.get('customId'));        
      }
    })
    return a;
  }
  var renderMapper = function(graph, object, position, objectAttr, package, elementChangeHandler){
    var renderFn = function(g, o, p, attr, pkg){

      if(attr == null){
        var name = o.get("schemaName")+"."+o.get("name");
        attr = {
          size: { width: name.length*12+(name.length <=7 ? 40 : 0 ), height: 30 },
          attrs: { 
              rect: { fill: 'rgb(248,203,173)', stroke: "rgb(244,177,131)", "stroke-width": 2  },
            text: { text: name, fill: 'black'} 
          } 
        }
        // if(grap.hget("docket_view") != true)
        // {
        //   attr["hidden"] = true;
        // }
      }
      if(p != null)
      {
        attr["position"] = p;
      }

      // attr.model = new joint.shapes.devs.Model(attr).clone()
      if(o.get('graphId') == null){
        var t = new joint.shapes.basic.CustomRect(attr);
        o.set({graphId: t.id, rendered: true, package: package})
        if(t.get('hidden') == true)
        {
          t.set({customId: o.get("friendlyName")});
          g.trigger('remove', {model: t})
          return null;
        }
        else
        {
          t.set({customId: o.get("friendlyName")});
          g.addCell(t);
        }
      }
      return t;
    }
    var a = renderFn.apply(this, arguments);
    
    if(a)
    {
      a.on('change:position', _.debounce(elementChangeHandler, 500, { 'maxWait' : 1000 }));
      // console.log("customId -> "+a.get('customId'));
    }

    // dependencies;
    var references = object.get("references") || [];
    _.each(references, function(value, i){
      var key = package+"#"+value.get("friendlyName");
      objectAttr = window.tildaCache[key];
      var fn = X[value.get("_type")];
      var t = fn.apply(this, [graph, value, gotoNextPosition(position), objectAttr, package, elementChangeHandler])
      if(t != null)
      {
        console.log("customId -> "+ t.get('customId'));        
      }
    })
    return a;
  }
  X = {
    "View": renderView,
    "Object": renderObject,
    "Enumeration": renderEnumeration,
    "Mapper": renderMapper
  };
  return { renderObject: X };
})