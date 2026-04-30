import React from 'react';
import {EditBtree} from './EditBtree.tsx';
import { BTNode } from './types';
import { useState } from 'react';
import {Tree, TreeNode} from 'react-organizational-chart';

/** Turns a btree into a nice visual OrgChart. Top level gets a different node.
 * The rest is delegated to btreeToJSX.
 */
export function Btree(props) : JSX.Element  {

 const [text, setText] = useState("");
 const [edit, setEdit] = useState(false);
  const { head, label } = props;


  return (
    <div className="bTree">
      <Tree label={props.label}>{btreeToJSX(head,0)}</Tree>
    </div>

   
  );


//Recursively convert our btree to a OrgChart JSX element tree.
 function btreeToJSX(node: BTNode, index: number): JSX.Element {
    console.log("rendering node ", node.value, " at index ", index);
    function updateNodeValue(node: BTNode, index: number) {
        props.updateNodeValue(node, index);

    }
  return (
    <TreeNode
      label={
        <div
          className="btreeNode"
          title={node.value}
          style={{
            background: '#' + node.value,
          }}
        >
          {/* abbreviated label */}
          {/* {node.value.slice(0, 2).toUpperCase()} */}
          
          {<input type="text" value={node.value.slice(0, 2).toUpperCase()} onChange={e => {node.value = e.target.value; updateNodeValue(node, index)}} />}
        </div>
      }
    >
      {node.left && btreeToJSX(node.left, ++index)}
      {node.right && btreeToJSX(node.right, ++index)}
    </TreeNode>
  );
}

}


function toggleState()   {
//  const newNode = new Node();
console.log("toggling state");
  this.setState({showEdit: !this.state.showEdit});
}
