import { MigrationInterface, QueryRunner } from "typeorm";

export class changeColumnsAndConstrains1616288112190 implements MigrationInterface {
  name = "changeColumnsAndConstrains1616288112190";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "debt"
        RENAME COLUMN "iconUrl" TO "icon"`);
    await queryRunner.query(`ALTER TABLE "category"
        RENAME COLUMN "iconUrl" TO "icon"`);
    await queryRunner.query(`ALTER TABLE "account"
        RENAME COLUMN "iconUrl" TO "icon"`);
    await queryRunner.query(`ALTER TABLE "cycle_transaction"
        ALTER COLUMN "name" SET NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "cycle_transaction"."name" IS NULL`);
    await queryRunner.query(`ALTER TABLE "user"
        ALTER COLUMN "birthDate" DROP NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."birthDate" IS NULL`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ALTER COLUMN "name" SET NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "transaction"."name" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "transaction"."name" IS NULL`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ALTER COLUMN "name" DROP NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."birthDate" IS NULL`);
    await queryRunner.query(`ALTER TABLE "user"
        ALTER COLUMN "birthDate" SET NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "cycle_transaction"."name" IS NULL`);
    await queryRunner.query(`ALTER TABLE "cycle_transaction"
        ALTER COLUMN "name" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "account"
        RENAME COLUMN "icon" TO "iconUrl"`);
    await queryRunner.query(`ALTER TABLE "category"
        RENAME COLUMN "icon" TO "iconUrl"`);
    await queryRunner.query(`ALTER TABLE "debt"
        RENAME COLUMN "icon" TO "iconUrl"`);
  }
}
