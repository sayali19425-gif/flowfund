// FlowFund – Soroban Contract Interface
// Replace CONTRACT_ID after deploying to testnet

export const CONTRACT_ID = 'CADDNP7CPQF737YKYXUJBLESA2DLZDBJVUON4FRB7GJTRHV3LILLIHO5'
export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'
export const RPC_URL = 'https://soroban-testnet.stellar.org'

export async function createProject(creatorKeypair, funderPubKey, milestoneCount, totalXLM) {
  console.log('createProject called', { funderPubKey, milestoneCount, totalXLM })
  // Wire up Stellar SDK calls here after deploying contract
}

export async function submitMilestone(creatorKeypair, projectId, milestoneIndex, proofHash) {
  console.log('submitMilestone called', { projectId, milestoneIndex, proofHash })
}

export async function approveMilestone(funderKeypair, projectId, milestoneIndex) {
  console.log('approveMilestone called', { projectId, milestoneIndex })
}

export async function getProject(projectId) {
  console.log('getProject called', { projectId })
}