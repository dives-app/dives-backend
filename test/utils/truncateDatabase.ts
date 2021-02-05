import { getManager } from "typeorm";

/**
 * Deletes all data from all tables
 */
export async function truncateDatabase() {
  await getManager().query(
    `TRUNCATE 
    "account", 
    "budget", 
    "budget_membership", 
    "category", 
    "cycle_transaction", 
    "debt", 
    "merchant", 
    "notification", 
    "plan", 
    "purchase", 
    "transaction", 
    "user" 
    CASCADE;`
  );
}
