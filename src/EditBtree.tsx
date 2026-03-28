//https://www.npmjs.com/package/react-organizational-chart
//https://daniel-hauser.github.io/react-organizational-chart/?path=/docs/example-tree--styled
import {useState} from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { BTNode } from './types';

/** Turns a btree into a nice visual OrgChart. Top level gets a different node.
 * The rest is delegated to btreeToJSX.
 */
export function EditBtree(props) : JSX.Element  {
  const [showEdit, setShowEdit] = useState(false);
  const { left } = props;

  // console.log("props left node left props ", JSON.stringify(props.node.value));
 if (props.node != null) {
  return (
    <div className="editBtree">
     

        <TreeNode
      label={
        <div
          className="btreeNode"
          title={props.node.value}
          style={{
            background: '#' + props.node.value,
          }}
        >
          {/* abbreviated label */}
          {props.node.value.slice(0, 2).toUpperCase()}
          
 {/* { showEdit ?  <EditBtree label="Edit node"  /> : null } */}


       <button onClick={() => setShowEdit(!showEdit)}>
  Activate Lasers
</button>
        </div>
      }
    >
      {props.node && <EditBtree props={props.node.left}  />}
      {props.node && <EditBtree props={props.node.right}  />}
      
    </TreeNode>

      

  
    </div>
  );
}
}

//Recursively convert our btree to a OrgChart JSX element tree.
