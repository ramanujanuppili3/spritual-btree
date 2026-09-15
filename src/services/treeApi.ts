const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

// ✅ Create a new node
export async function createNode(
  parentNodeId: string | null,
  position: 'left' | 'right',
  value: string
): Promise<{ success: boolean; node: any }> {
  try {
    const payload = {
      parentNodeId: parentNodeId || null,
      position,
      value: value || 'new'
    };

    console.log(`➕ API: Creating new ${position} node under parent ${parentNodeId} with value: ${value}`);
    console.log("📤 Request payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${API_BASE_URL}/api/btree/node/create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const responseText = await response.text();
    console.log("📥 Response status:", response.status);
    console.log("📥 Response body:", responseText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText || response.statusText}`);
    }

    const data = JSON.parse(responseText);

    console.log("✅ Node created successfully:", data);

    return data;

  } catch (err) {
    console.error("❌ Error creating node:", err);
    throw err;
  }
}

// ✅ Update node by ID on backend
export async function updateNodeById(
  nodeId: string,
  newValue: string
): Promise<{ success: boolean; node: any }> {
  try {
    console.log(`🔧 API: Updating node ${nodeId} with value: ${newValue}`);

    const response = await fetch(
      `${API_BASE_URL}/api/btree/node/${nodeId}/update`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ Node updated successfully:", data);

    return data;

  } catch (err) {
    console.error("❌ Error updating node:", err);
    throw err;
  }
}

// ✅ Update node at specific index
export async function updateNodeByIndex(
  rootNodeId: string,
  targetIndex: number,
  newValue: string
): Promise<{ success: boolean; node: any }> {
  try {
    console.log(`🔧 API: Updating node at index ${targetIndex}`);

    const response = await fetch(
      `${API_BASE_URL}/api/btree/update-by-index`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rootNodeId,
          targetIndex,
          newValue
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ Node at index updated:", data);

    return data;

  } catch (err) {
    console.error("❌ Error updating node by index:", err);
    throw err;
  }
}

// ✅ Batch update multiple nodes
export async function batchUpdateNodes(
  updates: Array<{ nodeId: string; value: string }>
): Promise<{ success: boolean; updatedCount: number }> {
  try {
    console.log(`🔧 API: Batch updating ${updates.length} nodes`);

    const response = await fetch(
      `${API_BASE_URL}/api/btree/batch-update`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ Batch update complete:", data);

    return data;

  } catch (err) {
    console.error("❌ Error in batch update:", err);
    throw err;
  }
}

// ✅ Fetch node by ID
export async function fetchNodeById(nodeId: string): Promise<any> {
  try {
    console.log(`📡 API: Fetching node ${nodeId}`);

    const response = await fetch(
      `${API_BASE_URL}/api/btree/node/${nodeId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ Node fetched:", data);

    return data;

  } catch (err) {
    console.error("❌ Error fetching node:", err);
    throw err;
  }
}