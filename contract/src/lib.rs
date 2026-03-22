#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum MilestoneStatus {
    Pending,
    Submitted,
    Approved,
    Rejected,
}

#[contracttype]
#[derive(Clone)]
pub struct Milestone {
    pub label:   String,
    pub status:  MilestoneStatus,
    pub proof:   String,
    pub xlm_pct: u32,
}

#[contracttype]
#[derive(Clone)]
pub struct Project {
    pub id:           u64,
    pub creator:      Address,
    pub funder:       Address,
    pub milestones:   Vec<Milestone>,
    pub total_xlm:    i128,
    pub released_xlm: i128,
    pub is_complete:  bool,
}

#[contracttype]
pub enum DataKey {
    Project(u64),
    Counter,
}

#[contract]
pub struct FlowFundContract;

#[contractimpl]
impl FlowFundContract {

    pub fn create_project(
        env: Env,
        creator: Address,
        funder: Address,
        milestone_labels: Vec<String>,
        total_xlm: i128,
    ) -> u64 {
        creator.require_auth();

        let id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::Counter)
            .unwrap_or(0u64) + 1;

        env.storage().instance().set(&DataKey::Counter, &id);

        let count = milestone_labels.len();
        let base_pct = 100u32 / count;
        let mut milestones: Vec<Milestone> = Vec::new(&env);

        for label in milestone_labels.iter() {
            milestones.push_back(Milestone {
                label,
                status: MilestoneStatus::Pending,
                proof: String::from_str(&env, ""),
                xlm_pct: base_pct,
            });
        }

        let project = Project {
            id,
            creator,
            funder,
            milestones,
            total_xlm,
            released_xlm: 0,
            is_complete: false,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Project(id), &project);
        id
    }

    pub fn submit_milestone(
        env: Env,
        project_id: u64,
        milestone_idx: u32,
        proof_hash: String,
    ) {
        let mut project: Project = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        project.creator.require_auth();

        let mut milestone = project.milestones.get(milestone_idx).unwrap();
        milestone.status = MilestoneStatus::Submitted;
        milestone.proof = proof_hash;
        project.milestones.set(milestone_idx, milestone);

        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    pub fn approve_milestone(
        env: Env,
        project_id: u64,
        milestone_idx: u32,
    ) {
        let mut project: Project = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        project.funder.require_auth();

        let mut milestone = project.milestones.get(milestone_idx).unwrap();
        milestone.status = MilestoneStatus::Approved;

        let release_amount = (project.total_xlm * milestone.xlm_pct as i128) / 100;
        project.released_xlm += release_amount;
        project.milestones.set(milestone_idx, milestone);

        let all_done = project
            .milestones
            .iter()
            .all(|m| m.status == MilestoneStatus::Approved);
        project.is_complete = all_done;

        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    pub fn reject_milestone(
        env: Env,
        project_id: u64,
        milestone_idx: u32,
    ) {
        let mut project: Project = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        project.funder.require_auth();

        let mut milestone = project.milestones.get(milestone_idx).unwrap();
        milestone.status = MilestoneStatus::Rejected;
        project.milestones.set(milestone_idx, milestone);

        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    pub fn get_project(env: Env, project_id: u64) -> Project {
        env.storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap()
    }

    pub fn get_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::Counter)
            .unwrap_or(0u64)
    }
}