import React, { useRef, useEffect } from 'react';
import {select , hierarchy, tree, linkHorizontal } from "d3";
import useWidthManager from "./useWidthManager";
import "./ChartsFamily.css";



function ChartsFamily() {
    const data = JSON.parse(localStorage.getItem("FamilyTree"));

    function plistIterator(children){
            let name = `${children.userdata.firstName} ${children.userdata.lastName}, Relation: ${children.userdata.Relation}`;
            
            delete children.userdata
            delete children.parent
            delete children.depth
            children["name"] = name;
            children["children"] = children.childrens;
            delete children.childrens

            
            children.children.forEach((child , index ) => {
                
                    plistIterator(child);
            
            });
            
          
        return children;
      }

      const lists = plistIterator(data);
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = { width: 600, height: 1000};


    useEffect( () => {
        const svg = select(svgRef.current);

        const root = hierarchy(lists);


        const treeLoyout = tree().size([dimensions.width, dimensions.height]);
        const linkGenerator = linkHorizontal()
                .x(link => link.y)
                .y(link => link.x);

        treeLoyout(root);

        console.log(root.descendants());
        console.log(root.links());

        svg.selectAll(".node")
            .data(root.descendants())
            .join("circle")
            .attr("class", "node")
            .attr("r",4)
            .attr("fill", "black")
            .attr("cx", node=> node.y)
            .attr("cy", node=> node.x);

        svg.selectAll(".link").data(root.links())
            .join("path")
            .attr("class", "link")
            .attr("d", linkGenerator)
            .attr("fill" , "none")
            .attr("stroke", "black")
            .attr("opacity", 0.5);;

        svg.selectAll(".label")
            .data(root.descendants())
            .join(enter => enter.append("text").attr("opacity", 0))
            .attr("class", "label")
            .attr("x", node => node.y)
            .attr("y", node => node.x - 12)
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .text(node => node.data.name)
            .transition()
            .duration(100)
            .delay(node => node.depth * 300)
            .attr("opacity", 1);

    }, [ lists , dimensions])

    return (
        <div>
            <svg ref={svgRef}></svg>
        </div>
    )
}

export default ChartsFamily
