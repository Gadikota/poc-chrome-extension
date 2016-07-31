define(["jointjs", "lodash", "jquery",
 "./parser_element", "./helpers"],
 function(joint, _, $, ParserElement, Helpers){
  var renderObject = Helpers.renderObject;

  var renderLink = function(graph, source, target){
    var attrs = {
      '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
    }
    if(source.get('_type') == "Object"){
      if(target.get("inSchema")){
        attrs = _.merge(attrs, {
          '.connection': { stroke: 'rgb(65,113,156)', 'stroke-width': 1 }
        })
      } else {
        attrs = _.merge(attrs, {
          '.connection': { stroke: 'rgb(5,113,156)', 'stroke-width': 1, 'stroke-dasharray': '5 2' }
        })
      }
    } else if(source.get('_type') == "View"){
      if(target.get("inSchema")){
        attrs = _.merge(attrs, {
          '.connection': { stroke: 'rgb(0,176,80)', 'stroke-width': 1 }
        })
      } else {
        attrs = _.merge(attrs, {
          '.connection': { stroke: 'rgb(0,176,80)', 'stroke-width': 1, 'stroke-dasharray': '5 2' }
        })
      }
    } else if(source.get('_type') == "Mapper"){
      if(target.get("inSchema")){
        attrs = _.merge(attrs, {
          '.connection': { stroke: 'rgb(248,203,173)', 'stroke-width': 1 }
        })
      } else {
        attrs = _.merge(attrs, {
          '.connection': { stroke: 'rgb(248,203,173)', 'stroke-width': 1, 'stroke-dasharray': '5 2' }
        })
      }
    }
    var link = new joint.dia.Link({
      source: { id: source.get("graphId") },
      target: { id: target.get("graphId") },
      attrs: attrs
    });
    link.on('change', _.debounce(function(element){
      var source = element.getSourceElement();
      var eventObject = that.objects.findWhere({graphId: source.get("id")});
      var links = eventObject.get("data").links;
      if(eventObject.get("data").links == null){
        eventObject.get("data").links = {};
        var links = eventObject.get("data").links;
      }
      links[element.get("id")] = element.toJSON();
    }, 500, { 'maxWait' : 1000 }));
    graph.addCell(link);
  }

  var renderObjectRelations = {
    // This method will add outSchema object
    "Object": function(graph, object, superset, position){
      if(object.get("data").foreign != null){
        // var rels = _.map(object.get("data").foreign, function(ele, i){ return ele.destObject });
        var rels = [];
        _.each(object.get("data").columns, function(ele, i){
          if(ele.sameas != null && ele.sameas.split(".").length > 1 ){
            rels.push(ele.sameas.split(".").reverse()[1]);
          }
        })
        rels = _.uniq(rels);
        _.each(rels, function(relation, i){
          var target = superset.findWhere({name: relation}, {caseInsensitive: true})
          if(target == null){
            target = new ParserElement({data: {name: relation }, name: relation, _type: "Object", inSchema: false });
            superset.add(target);
            renderObject[target.get("_type")](graph, target, position);
          } else if(target.get("graphId") == null){// which means object is on in graph
            renderObject[target.get("_type")](graph, target, position);
          }
          renderLink(graph, object, target)
        })
      }
    },
    "View": function(graph, object, superset, position){
      var rels = [];
      _.each(object.get("data").columns, function(ele, i){
        if(ele.sameas != null && ele.sameas.split(".").length > 1 ){
          rels.push(ele.sameas.split(".").reverse()[1]);
        }
      })
      rels = _.uniq(rels);
      _.each(rels, function(relation, i){
        var target = superset.findWhere({name: relation}, {caseInsensitive: true})
        if(target == null){
          target = new ParserElement({data: {name: relation }, name: relation, _type: "Object", inSchema: false });
          superset.add(target);
          renderObject[target.get("_type")](graph, target, position);
        } else if(target.get("graphId") == null){// which means object is on in graph
          renderObject[target.get("_type")](graph, target, position);
        }
        renderLink(graph, object, target)
      })

    },
    "Mapper": function(graph, object, superset){
      var rels = [];
      _.each(object.get("data").primaryColumns, function(ele, i){
        if(ele.sameas != null && ele.sameas.split(".").length > 1 ){
          rels.push(ele.sameas.split(".").reverse()[1]);
        }
      })
      rels = _.uniq(rels);
      _.each(rels, function(relation, i){
        var target = superset.findWhere({name: relation}, {caseInsensitive: true})
        if(target == null){
          target = new ParserElement({data: {name: relation }, name: relation, _type: "Object", inSchema: false });
          superset.add(target);
          renderObject[target.get("_type")](graph, target, position, {});
        } else if(target.get("graphId") == null){// which means object is on in graph
          renderObject[target.get("_type")](graph, target, position, {});
        }

        renderLink(graph, object, target)
      })

    }
  }
  return renderObjectRelations;
});