//Globals declared
var child_selected = 0;
var item_selected = {};
var colorSelected = "white";

// Get current mouse position
function getMousePosition(evt) {
  var svg = evt.target;
  var CTM = svg.getScreenCTM();
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d
  };
}

// Onload on main SVG layout
function setDraggable(evt) {

  var selectedElement = false;
  var svg = evt.target;
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);  
  var x1,y1,x2,y2 = null ;

  function startDrag(evt) {

            colorSelected = document.getElementById("favcolor").value ;

            console.log("item_selected.item : " + item_selected.item);

            if (x1 == null && y1 == null && x2 == null && y2==null){

              startPoint = getMousePosition(evt);
              x1 = startPoint.x;
              y1 = startPoint.y;
              console.log("startDrag > x1 > " + x1 + " y1 > " + y1);

            } else if ( item_selected.item == "0"  && x2 == null && y2==null ) {                                                                          
              
              var endPoint = getMousePosition(evt);
              x2 = endPoint.x;
              y2 = endPoint.y;
              console.log("startDrag > x2 > " + x2 + " y2 > " + y2);

              const parent = document.getElementById("mainlayout");
              const para = document.createElementNS('http://www.w3.org/2000/svg','line');      
              para.setAttribute("x1", x1);
              para.setAttribute("y1", y1);
              para.setAttribute("x2", x2);
              para.setAttribute("y2", y2);
              para.setAttribute("style", "stroke:white;stroke-width:2;");
              parent.append(para);
              console.log(para);
              
              item_selected = {};
              x1 = null;
              y1 = null;
              x2 = null;
              y2 = null;
              colorSelected = "white";

            } else if ( item_selected.item == "1"  && x2 == null && y2==null && x1 != null && y1!=null ) { 
              var endPoint = getMousePosition(evt);
              x2 = endPoint.x;
              y2 = endPoint.y;
              console.log("startDrag > x2 > " + x2 + " y2 > " + y2);

              const rwidth = (x2 - x1) ;
              console.log(rwidth);
              const rheight = (y2 - y1) ; 
              const parent = document.getElementById("mainlayout");
              const para = document.createElementNS('http://www.w3.org/2000/svg','rect');      
              para.setAttribute("width", rwidth);
              para.setAttribute("height", rheight);
              para.setAttribute("x", x1);
              para.setAttribute("y", y1);
              para.setAttribute("fill", colorSelected);
              parent.append(para);
              console.log(para);
              
              item_selected = {};
              x1 = null;
              y1 = null;
              x2 = null;
              y2 = null;
              colorSelected = "white";

            } else if ( item_selected.item == "2"  && x2 == null && y2==null  && x1 != null && y1!=null ) { 
              var endPoint = getMousePosition(evt);
              x2 = endPoint.x;
              y2 = endPoint.y;

              radius =  Math.sqrt( Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
              console.log("startDrag > x2 > " + x2 + " y2 > " + y2);
              const parent = document.getElementById("mainlayout");
              const para = document.createElementNS('http://www.w3.org/2000/svg','circle');      
              para.setAttribute("r", radius);
              para.setAttribute("cx", x1);
              para.setAttribute("cy", y1);
              para.setAttribute("fill", colorSelected);
              parent.append(para);
              console.log(para);
              
              item_selected = {};
              x1 = null;
              y1 = null;
              x2 = null;
              y2 = null;
              colorSelected = "white";

            } else if ( item_selected.item == "3"  && x2 == null && y2==null ) { 

              var endPoint = getMousePosition(evt);
              x2 = endPoint.x;
              y2 = endPoint.y;
              console.log("startDrag > x2 > " + x2 + " y2 > " + y2);
              var fontSize = y2-y1;
              const parent = document.getElementById("mainlayout");
              const para = document.createElementNS('http://www.w3.org/2000/svg','text');      
              para.setAttribute("x", x1);
              para.setAttribute("y", y1);
              para.setAttribute("fill", colorSelected);
              para.setAttribute("font-size", fontSize);
              para.textContent = document.getElementById("favtext").value;
              parent.append(para);
              console.log(para);
              
              item_selected = {};
              x1 = null;
              y1 = null;
              x2 = null;
              y2 = null;
              colorSelected = "white";
            } else if ( item_selected.item == "4"  && x2 == null && y2==null ) { 

              var endPoint = getMousePosition(evt);
              x2 = endPoint.x;
              y2 = endPoint.y;
              var x_mid = x2;
              var y_mid = y1;
              var points = " "+x1+","+y1+" "+x_mid+","+y_mid+" "+x2+","+y2+" ";
              console.log("Polyline points : " + points);
              console.log("startDrag > x2 > " + x2 + " y2 > " + y2);
              const parent = document.getElementById("mainlayout");
              const para = document.createElementNS('http://www.w3.org/2000/svg','polyline');  
              para.setAttribute("points",points );
              para.setAttribute("stroke", "white");
              para.setAttribute("stroke-width", "3");
              para.setAttribute("fill", "none");
              para.setAttribute("marker-start", "url(#circle)");
              para.setAttribute("marker-mid", "url(#circle)");
              para.setAttribute("marker-end", "url(#arrow)");
              para.textContent = document.getElementById("favtext").value;
              parent.append(para);
              console.log(para);       
              item_selected = {};
              x1 = null;
              y1 = null;
              x2 = null;
              y2 = null;
              colorSelected = "white";

            } else { 
            }
    
    
            if (evt.target.classList.contains('draggable')) {
              selectedElement = evt.target;
              offset = getMousePosition(evt);
            }
  }

  function drag(evt) {
    
    if (selectedElement) {
      evt.preventDefault();
      var coord = getMousePosition(evt);
      x2 = coord.x;
      y2 = coord.y;

      var svgmain = document.getElementById("mainlayout");
      svgmain.innerHTML = "<line   x1="+ x1 + " y1="+ y1 + " x2=" + x2 + " y2=" + y2 +" style='stroke:white;stroke-width:2;' />  ";
    }

  }
  function endDrag(evt) {
    selectedElement = null;
    console.log("EndDrag1 : " + evt.target);

    
  }


}

function selectLine(evt){
  console.log("evt.target " + evt.target)
  if (evt.target instanceof SVGLineElement){
    item_selected = {item:"0"};
  } else if (evt.target instanceof SVGRectElement) {
    item_selected = {item:"1"};
  } else if (evt.target instanceof SVGCircleElement) {
    item_selected = {item:"2"};
  } else if (evt.target instanceof SVGTextElement && evt.target.textContent == "Text") {
    item_selected = {item:"3"};   
  } else if (evt.target instanceof SVGTextElement && evt.target.textContent == "Polyline") {
    item_selected = {item:"4"};
  } else if (evt.target instanceof SVGTextElement && evt.target.textContent == "Ploygon") {
    item_selected = {item:"5"}; 
  } else {
    item_selected = {};    
  } ;
  
}

function changeColor(){
  colorSelected = document.getElementById("favcolor").value ;
}

// For clearing canvas , entire elements in layout removed from tree.
// calls innerHTML to remove childs.
function ClearCanvas(evt){
  document.getElementById("mainlayout").innerHTML = "";
}

// *****************Deprecated******************
// Highlight the line with child circle at both ends
// based on location 
function changeLine(a,b){

   var c1 = document.getElementById(a);
   var c2 = document.getElementById(b);
  //  console.log(c1 + " - " + c2)
   if (child_selected == 0) {

   c1.style.opacity = "0.5";
   c2.style.opacity = "0.5";
   c1.setAttribute("fill","yellow" ) ;
   c2.setAttribute("fill","yellow" ) ;
   }
}

// *****************Deprecated******************
// Highlight the line with child circle at both ends
// based on location 
function clearLine(a,b){
  var c1 = document.getElementById(a);
  var c2 = document.getElementById(b);

  if (child_selected == 0) {

    c1.style.opacity = "0.0";
    c2.style.opacity = "0.0";
    c1.setAttribute("fill","yellow" ) ;
    c2.setAttribute("fill","yellow" ) ;

  }

}

// *****************Deprecated******************
// Highlight the line with child circle at both ends
// based on location 
function clickLine(a,b){
  var c1 = document.getElementById(a);
  var c2 = document.getElementById(b);
  
  if(child_selected == 0 ){
    child_selected = 1;
    c1.style.opacity = "0.9";
    c2.style.opacity = "0.9";
    c1.setAttribute("fill","red" ) ;
    c2.setAttribute("fill","red" ) ;
  } else {
    child_selected = 0;
    changeLine(a,b)
  }
}




