//tool palette shapes declare
const json_palette =    `{  
                            "item1" : { "type": "rect" , "width": 60, "height": 40, "x": 20, "y": 70 ,"rx":"30","ry":30, "s" : 0 , "f": "rgb(84,141,68)" , "sw" : 0 , "name": "Start" },
                            "item2" : { "type": "rect" , "width": 60, "height": 40, "x": 20, "y": 140 , "s" : 0 , "f": "rgb(102,119,204)" , "sw" : 0 , "name": "Step" },    
                            "item3" : { "type": "circle" , "cx": 50, "cy": 240, "r": 30 , "s" : 0 , "f": "rgb(183,6,6)" , "sw" : 0 , "name" : "End"}                             
                        }`;

                        
                        // "item4" : { "type": "line" , "x1": 20, "y1": 40 , "x2": 80 , "y2": 40, "style":"stroke:yellow;stroke-width:2" , "name": "" } 
const angle =   {
                    CW0 : 0,
                    CW360 : 2 * Math.PI,
                    CW90 : Math.PI / 2,
                    CW180 : Math.PI,
                    CW270 : 0.75 * Math.PI
                };

var palette_items = JSON.parse(json_palette);
var shape_pressed = 0;
var onmove = undefined;
var curr_item_postn = new Map();
var item_anchor_postn = new Map();
var x_items = new Map();
var y_items = new Map();

var prev_link = undefined;

var start_point = {};
var last_postn = {};

var currentElementSelection = undefined;
//const selectionStyle = {"stroke":"yellow","stroke-width":"5","stroke-opacity":"0.4"};
var selectedElement, offset, gtfm = undefined;
var linkableElement = undefined;
const PALETTE_SIZE = {"WIDTH": 100 , "HEIGHT" : 600};

window.onload = init;

window.addEventListener("keydown", SVGKeyPress);
    
function init(){

    const svg = document.getElementById("mainlayout");     

    svg.addEventListener('mousedown', SVGStartDrag);
    svg.addEventListener('mousemove', SVGDrag);
    svg.addEventListener('mouseup', SVGEndDrag);
    svg.addEventListener('dblclick', addtext); 

    console.log("Initializing started..."); 
    
    var g = new GridLayout("mainlayout","v", 60, 70);
    var gXY = g.buildGridXY();

    console.log(gXY);
    for (const key in palette_items) {
            let i = palette_items[key];            
            if ( gXY.hasOwnProperty(key)){
                console.log(key + " - key found")
                if(i.hasOwnProperty('x')) {
                    console.log(i['x']);
                    console.log(gXY[key]['x']);
                    i['x'] = gXY[key]['x'];
                    i['y'] = gXY[key]['y'];
                } else if (i.hasOwnProperty('cx') ){
                    console.log(i['cx']);
                    console.log(gXY[key]['cx']);
                    i['cx'] = gXY[key]['cx'];
                    i['cy'] = gXY[key]['cy'];
                } else if (i.hasOwnProperty('x1') ){
                    console.log(i['x1']);
                    console.log(gXY[key]['x']);
                    i['x1'] = gXY[key]['x'];
                    i['y1'] = gXY[key]['y'];
                    i['x2'] = gXY[key]['x'] + g.itmWidth;
                    i['y2'] = gXY[key]['y'] + g.itmHeight;
                    
                }
                const s = new Shape(i);
                console.log(i);
                const grp_el = new Renderer(key, s.prep());  
                console.log(grp_el);
                svg.append(grp_el.draw());  
            }
                        
    };     
    
    console.log("Initializing complete...");   
    
}

function CE(type){
    const e = document.createElementNS('http://www.w3.org/2000/svg',type);
    return e;
};

function SA(e,k,v){
    return e.setAttribute(k,v);
};

function HA(e,k){
    return e.hasAttribute(k);                
};

function GA(e,k){
    return e.getAttribute(k);
};

function RA(e,k){
    e.removeAttribute(k);
};

function random() {
    return Math.floor((Math.random() * 100000));
};

function innerDisplay(e, t, x ,y){    
    const grp = CE('g'); 
    const el = textadd(t,x, y, "white");
    grp.append(e); 
    grp.append(el);
    return grp;
};

function getMousePosition(evt) {
    const svg = document.getElementById("mainlayout");   
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
}


function textadd(val,x, y, shade){
    const txt = document.createElementNS('http://www.w3.org/2000/svg','text');      
    txt.setAttribute("x", x);
    txt.setAttribute("y", y);
    txt.setAttribute("fill", shade);
    txt.setAttribute("font-size", 20);
    txt.setAttribute("alignment-baseline", "middle" );
    txt.setAttribute("transform", "translate(5,5)" );
    txt.setAttribute("class", "draggable palette zi0" );
    //txt.setAttribute("style","dominant-baseline:central; text-anchor:middle;");
    txt.textContent = val;
    return txt;
  }

//Inside setDraggable
function addtext(evt){

    var e = evt.target;
    var p = document.getElementById("mainlayout");
    let w,h,x,y,cx,cy = undefined;

    if (e instanceof SVGRectElement || e instanceof SVGCircleElement){
      console.log(" Inside dblclick" + e);
    
      if (e instanceof SVGRectElement ) {
        w = parseFloat(evt.target.getAttribute("width"));
        h = parseFloat(evt.target.getAttribute("height"));
        x = parseFloat(evt.target.getAttribute("x"));
        y = parseFloat(evt.target.getAttribute("y"));
      } else if (e instanceof SVGCircleElement ) {
        cx = parseFloat(evt.target.getAttribute("cx"));
        cy = parseFloat(evt.target.getAttribute("cy"));
      }

      const frgn = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');      
      frgn.setAttribute("x", x);
      frgn.setAttribute("y", y);
      frgn.setAttribute("width", w);
      frgn.setAttribute("height", h);
      //frgn.setAttribute("transform", "translate(5,5)" );
      p.append(frgn);
      
      const ta = document.createElement("textarea");  
      ta.setAttribute("style", "color: white ;"); 
      //ta.setAttribute("transform", "translate(2,2)" );
      ta.addEventListener("focusout", (event) => {    
        
            const ta_value = ta.value;
            frgn.remove();
            const grp = document.createElementNS('http://www.w3.org/2000/svg','g');  
            //grp.setAttribute("transform", "translate(2,2)" );    
            grp.append(e);
            const t = textadd(ta_value, x +10 , y +50  , "purple");
            grp.append(t);
            p.append(grp);



      });
      // ta.setAttribute("cols", 2);    
      frgn.append(ta);

      console.log(frgn);

    }

  }

///Create SVG element properties for a shape defined in input item object
//Step 1
class Shape {
    constructor(item){
        this.item = item;
    }    
    prep(){
        let d = {};
        for(let k in this.item){
            const v = this.item[k];
            if(k == "s") { k = "stroke"};
            if(k == "sw") { k = "stroke-width"};
            if(k == "f") { k = "fill"};
            d[k] = v;
        }
        // console.log(d);
        return d ;
    }
}

//Step 3
class Renderer {
    constructor(item_name ,data){
        this.item_name = item_name;
        this.data = data;
    }

    draw(){             
        const e = CE(this.data.type);
        const d = this.data;
        // console.log(d);
        for (let k in d){
            if(k == "type" || k == "name") {continue};
            SA(e,k,d[k]);
        }     
        SA(e,"onclick", "Renderer.itemSelected(event)")  ;
        SA(e,"id", `${this.item_name}-${random()}`);
        SA(e,"class","draggable palette");
        if (d.hasOwnProperty("x")){
            const grp = innerDisplay(e, this.data.name , this.data.x + 5, this.data.y + 15 );
            return grp;
        } else if (d.hasOwnProperty("cx")) {
            const grp = innerDisplay(e, this.data.name , this.data.cx - 20, this.data.cy  );
            return grp;
        }  else if (d.hasOwnProperty("x1")) {
            const grp = innerDisplay(e, this.data.name , this.data.x1 , this.data.y2  );
            return grp;
        }  
        console.log(grp);
        
    }

    static itemSelected(evt){
        
        const el = evt.target; 
        const eid = GA(el,"id") ;
        console.log("Inside itemSelected Before: " + currentElementSelection);
        // if (currentElementSelection == null || currentElementSelection != eid){
            if (el.classList.contains('palette')){
                SA(el,"class", "draggable-selected draggable palette zi0"); 
            } else {
                if (el.classList.contains('draggable-selected') ){
                    SA(el,"class", "draggable-selected linkable draggable itm");
                    linkableElement = el;                    
                    console.log("linkableElement : " + linkableElement);
                } else {
                    SA(el,"class", "draggable-selected draggable itm");
                }   
            }
            
            currentElementSelection = eid ; 
            console.log("Inside itemSelected After: " + currentElementSelection);
        // } 
        //Renderer.itemDeselect(false);
    }

    static itemDeselect(a){

        console.log("Inside itemDeselect Before: " + currentElementSelection);

        //Click on svg layout
        if (a == true){
            currentElementSelection = undefined;
        }

        //When a item is selected
        const nodes = document.querySelectorAll(".draggable-selected");
        for ( let i = 0 ; i< nodes.length ; i++){
            const e = nodes[i];
            const id = GA(e, "id");
            if ( id !==  currentElementSelection ){
                if (e.classList.contains('palette') ) {
                    SA(e, "class", "draggable palette");
                } else {
                    SA(e, "class", "draggable");
                }
                
            }           
        }

        console.log("Inside itemDeselect After: " + currentElementSelection);
        
    }
}



function create(){

    const e = document.getElementById(currentElementSelection);
    var svg = document.getElementById("mainlayout"); 
    console.log("Inside create() ");
    if (e !== null){
        
        const cnode = e.cloneNode(true);
        SA(cnode, "class" , "draggable-selected draggable itm");
        SA(cnode,"id", random());
        console.log(cnode);
        svg.append(cnode);
        currentElementSelection = GA(cnode,"id");
        console.log("create() : currentElementSelection :" +currentElementSelection);
        shape_pressed++;
        console.log("shape_created : " + shape_pressed);
        return cnode;
    }
    
}
    

function SVGStartDrag(evt){

    let e = evt.target;
    const id = GA(e,"id");

    
    //Only for svg layout clicks
    if( id === "mainlayout") {
        Renderer.itemDeselect(true);
    } 

    if(id !== "mainlayout" &&  id !== null) {

        console.log("Inside SVGStartDrag : id :" + id);
        currentElementSelection = GA(e,"id");

        //Create a new item when a palette item is selected for drag else drag item along the main layout.
        if (e.classList.contains('palette')){
            console.log("Inside SVGStartDrag : Calling create()")
            selectedElement = create(); 
        } else {
            selectedElement  = e ;
        }
        
        onmove = GA(selectedElement , "id");

        //Only on Item clicks
        if (e.classList.contains('draggable-selected')){
                console.log("Inside If of SVGStartDrag ");  
                console.log(evt.target);
                console.log("e.classList.contains('palette') : " + e.classList.contains('palette'))
                
                const svg = document.getElementById("mainlayout");              

                offset = getMousePosition(evt);

                let transforms = selectedElement.transform.baseVal;

                if (transforms.length === 0 || transforms.getItem(0).type  === SVGTransform.SVG_TRANSFORM_TRANSLATE){

                    var translate = svg.createSVGTransform();
                    translate.setTranslate(0, 0);
                    transforms.insertItemBefore(translate, 0);
                }
                gtfm = transforms.getItem(0);

        }
    }
    

}

function SVGDrag(evt){

    let e = evt.target;
    const id = GA(e,"id");
    console.log("Inside SVGDrag : id :" + id);
    
    if(id === "mainlayout" && linkableElement !== undefined) {

        const curr_postn = getMousePosition(evt);

        // let possible_move_dir = 1; 
        // if (last_postn ===  null) {
        //     last_postn.x = curr_postn.x;
        //     last_postn.y = curr_postn.y;
        // } else if ( (last_postn["x"] - curr_postn.x ) < (last_postn["y"] - curr_postn.y ) ){
        //     possible_move_dir = 0; 
        // }
        // console.log("linkableElement : " + linkableElement +  ", possible_move_dir : " + possible_move_dir );
        // last_postn.x = curr_postn.x;
        // last_postn.y = curr_postn.y;

        if (linkableElement !== undefined && shape_pressed > 1) {
            const start_point = item_coord(linkableElement.id);
            const start = anchor_link(start_point,curr_postn);

            const closet_point = item_coord(find_closet(linkableElement.id));
            const end  = anchor_link(closet_point,curr_postn);

            const svg = document.getElementById("mainlayout");  

            if(prev_link !== undefined) {
                prev_link.remove();
            }   
            const el = CE('line');
            SA(el, "x1", start.x );
            SA(el, "y1", start.y );
            SA(el, "x2", end.x );
            SA(el, "y2", end.y );
            SA(el , "style" , "stroke:yellow;stroke-width:1");
            svg.append(el);

            prev_link = el;

            console.log(el);

            console.log("start.x : " +  start.x +  " , start.y : "+ start.y + " , end.x : " + end.x +  " , end.y : " + end.y  );

        }        

    }
    
    if (e.classList.contains('draggable-selected') && offset !== undefined){

        const coord = getMousePosition(evt);

        if (currentElementSelection !== undefined){
                evt.preventDefault();            
                gtfm.setTranslate(coord.x - offset.x, coord.y - offset.y);
                
        }
    }

}

function SVGEndDrag(evt){

    let e = evt.target;
    let id = GA(e,"id");
    var svg = document.getElementById("mainlayout"); 

    // if(id !== "mainlayout" &&  id !== null) {
    console.log("Inside SVGEndDrag Id: " + id + " , onmove : " + onmove); 
    
    if (offset !== undefined) {

        

        evt.preventDefault();

        const coord = getMousePosition(evt);
        gtfm.setTranslate(coord.x - offset.x, coord.y - offset.y);

        let rect = document.getElementById(onmove).getBoundingClientRect();
        for (const key in rect) {
            console.log(`${key} : ${rect[key]}`);
        }
        curr_item_postn[id] = rect;

        
        offset = undefined;
        selectedElement= undefined; 
        gtfm= undefined;

    }    
    
    Renderer.itemDeselect(false);

    console.log("curr_item_postn : " + curr_item_postn);

    // for (const key in curr_item_postn) {
    //     console.log(`${key} : ${curr_item_postn[key]}`);
    // }
    onmove = undefined;

    // }
    point_trace();

   svg.append(prev_link) ;
   prev_link = undefined;
   linkableElement = undefined;

}

function SVGKeyPress(evt){

    console.log("Inside  SVGKeyPress ");
    console.log(evt.key);
    const svg = document.getElementById("mainlayout");

    if ( evt.key === "Delete"){
       const clt =  document.getElementsByClassName("draggable-selected") ;
    //    for (let i= 0 ; i < clt.length ; i++ ) {
            let e = clt[0];
            e.remove();
            point_trace();
    //    } 

    }
}


function point_trace(){

    console.log(" Inside point_trace " );

    var svgRect =  document.getElementById("mainlayout").getBoundingClientRect();
    const collection = document.getElementsByClassName("itm");

    console.log("collection.length : " +  collection.length);
    
    for (let i = 0; i < collection.length; i++) {
        let rect = document.getElementById(collection[i].id).getBoundingClientRect();
        let curr_id = collection[i].id;
        curr_item_postn[curr_id] = {  "x" : (rect.x - svgRect.x) 
                                    , "y" : (rect.y - svgRect.y)   
                                    , "width" : rect.width 
                                    , "height" : rect.height};

        x_items.set(curr_id , (rect.x - svgRect.x) );
        y_items.set(curr_id , (rect.y - svgRect.y) );

        //find_closet(curr_id); 

        item_anchor_postn[curr_id] = item_coord(curr_id);
    }

    console.log("curr_item_postn : " + curr_item_postn);

    for (const key in curr_item_postn) {
        console.log(`${key} : ${curr_item_postn[key]}`);
        console.log(curr_item_postn[key]);
    }

  
    x_items.forEach( function(value,key) {
        console.log(" X_ITEMS : Point trace => " + key + " : " + value  );
    });
    y_items.forEach( function(value,key) {
        console.log(" Y_ITEMS : Point trace => " + key + " : " + value  );
    });

    
    
}

function item_coord(id){

    if (id !== undefined){

        let rect = curr_item_postn[id];

        console.log("Inside item_coord  : id : " + id ) 

        let tcoord= {};

        tcoord["x1"] = rect.x + (rect.width / 2);
        tcoord["y1"] = rect.y;
        tcoord["x2"] = rect.x + rect.width;
        tcoord["y2"] = rect.y + ( rect.height / 2);
        tcoord["x3"] = rect.x + (rect.width / 2);
        tcoord["y3"] = rect.y + rect.height;
        tcoord["x4"] = rect.x;
        tcoord["y4"] = rect.y + ( rect.height / 2);
        return tcoord;
    }
    

}


function find_closet(id){


    if(id !== "mainlayout"){
        x = x_items.get(id);

        console.log("Inside find_closet : x : " + x);
        let dx = undefined;
        let closet_id = undefined;

        x_items.forEach( function(value,key) {   
            
            deltaX = Math.abs(x - value);
            if(id !== key) {
                if (dx === undefined){
                        dx = deltaX ;
                        closet_id = key;
                } else {
                        dx = deltaX < dx ?  deltaX  : dx;
                        closet_id = ( dx === deltaX) ? key : closet_id;
                }    
                console.log("Inside find_closet : key : " + key + ", value : " + value);
                console.log("Inside find_closet : dx : " + dx); 
                console.log("Inside find_closet : closet_id : " + closet_id);
            }
        });
        console.log("Id : " + id +  "  , closet_id : " + closet_id + " , x : " + x_items.get(closet_id));

        return closet_id;

        // let  a,b = undefined ;
        // a = item_coord(id);
        // b = item_coord(closet_id);
    
        // console.log("a.x1 : " + a["x1"] + " , a.y1 : "+ a["y1"]  );
        // console.log("b.x1 : " + b["x1"] + " , b.y1 : "+ b["y1"]  );

        // edge_highlight(a);
        // edge_highlight(b);
    }    

}

// anchor_link(start_point,curr_postn, possible_move_dir);
function anchor_link(anchors, cursor_postn ){

    let nearest = undefined;
    let point = {};
    
    console.log("Inside anchor_link : " + cursor_postn.x);
    // console.log("cursor_postn.x : " + cursor_postn.x);
    // console.log("cursor_postn.y : " + cursor_postn.y);
    // console.log("start_anchors.x1 : " + start_anchors.x1);
    // console.log("start_anchors.x2 : " + start_anchors.x2);
    // console.log("start_anchors.x3 : " + start_anchors.x3);
    // console.log("start_anchors.x4 : " + start_anchors.x4);                              
    // console.log("start_anchors.y1 : " + start_anchors.y1);
    // console.log("start_anchors.y2 : " + start_anchors.y2);
    // console.log("start_anchors.y3 : " + start_anchors.y3);
    // console.log("start_anchors.y4 : " + start_anchors.y4);
    // console.log("(start_anchors.x2 - cursor_postn.x) : " + (start_anchors.x2 - cursor_postn.x));
    // console.log("(start_anchors.x4 - cursor_postn.x) : " + (start_anchors.x4 - cursor_postn.x));

    a = Math.abs(anchors.x1 - cursor_postn.x) + Math.abs(anchors.y1 - cursor_postn.y);
    b = Math.abs(anchors.x2 - cursor_postn.x) + Math.abs(anchors.y2 - cursor_postn.y);
    c = Math.abs(anchors.x3 - cursor_postn.x) + Math.abs(anchors.y3 - cursor_postn.y);
    d = Math.abs(anchors.x4 - cursor_postn.x) + Math.abs(anchors.y4 - cursor_postn.y);
    x = [a , b , c ,d ];
    console.log(x);
    for(i in x ){

        if (nearest == undefined){
            nearest = i;
        } else if ( x[nearest] > x[i]) {
            nearest = i;
        }			
        console.log(i);
        console.log(x[i]);
    }

    console.log("nearest : " + nearest);

    switch(nearest) {
        case "0" : {
            point["x"] = anchors.x1;
            point["y"] = anchors.y1;
            break;
        }
        case "1" : {
            point["x"] = anchors.x2;
            point["y"] = anchors.y2;
            break;
        }
        case "2" : {
            point["x"] = anchors.x3;
            point["y"] = anchors.y3;
            break;
        }
        case "3" : {
            point["x"] = anchors.x4;
            point["y"] = anchors.y4;
            break;
        }
    }
    console.log("point x : " + point.x + " , y : " + point.y);

    return point;

}


// function edge_highlight(coord){

//     var svg = document.getElementById("mainlayout"); 

//     const e1 = CE("circle");
//     SA(e1, "cx" , coord.x1);
//     SA(e1, "cy" , coord.y1);
//     SA(e1, "r" , 2);
//     SA(e1, "fill" , "white");

//     const e2 = CE("circle");
//     SA(e2, "cx" , coord.x2);
//     SA(e2, "cy" , coord.y2);
//     SA(e2, "r" , 2);
//     SA(e2, "fill" , "white");

//     const e3 = CE("circle");
//     SA(e3, "cx" , coord.x3);
//     SA(e3, "cy" , coord.y3);
//     SA(e3, "r" , 2);
//     SA(e3, "fill" , "white");

//     const e4 = CE("circle");
//     SA(e4, "cx" , coord.x4);
//     SA(e4, "cy" , coord.y4);
//     SA(e4, "r" , 2);
//     SA(e4, "fill" , "white");

//     svg.append(e1);
//     svg.append(e2);
//     svg.append(e3);
//     svg.append(e4);

// }




//Step 2
class GridLayout {

    constructor(containerId , axis ,itmWidth, itmHeight ){
        this.axis = axis;
        this.containerId = containerId;
        this.itmWidth = itmWidth + 4;
        this.itmHeight = itmHeight + 4 ;
    }

    // Generate max size of cells based on SVG width and height 
    lotSize(){

        const el = document.getElementById(this.containerId); 
        const w = PALETTE_SIZE.WIDTH;
        const h = PALETTE_SIZE.HEIGHT;
        let s = null;

        if (this.axis == "v"){
            s = Math.ceil( h / this.itmHeight);
        } else if (this.axis == "h") {
            s = Math.ceil( w / this.itmWidth);
        } else if (this.axis == "vh") {
            s = Math.ceil( h / this.itmHeight) * Math.ceil( w / this.itmWidth); 
        }
        return s;
    }


    // Creates an object with  item map and x,y,cx,cy coordinates
    buildGridXY(){

        const el = document.getElementById(this.containerId); 
        const w = PALETTE_SIZE.WIDTH;
        const h = PALETTE_SIZE.HEIGHT;

        let gridXY = {};
        let x, y , cx, cy = undefined;

        for(let i = 0; i < this.lotSize() ; i++){

            if (x == undefined && y == undefined){                
                if (this.axis == "v"){
                    x = Math.ceil( ( w - this.itmWidth) / 2 ) ;
                    y = 20;
                } else if (this.axis == "h") {
                    x = 20;
                    y = Math.ceil( ( h - this.itmHeight) / 2 );
                } 
            }
            else{
                
                
                if (this.axis == "v"){
                    y += this.itmHeight;
                } else if (this.axis == "h") {
                    x += this.itmWidth;                
                } 


            }  
            cx = x + (this.itmWidth/ 2);
            cy = y + (this.itmHeight/ 2);

            let key =  `item${i+1}`;
            gridXY[key] = {x,y, cx , cy };

        };
        return gridXY;

        
    }
}









