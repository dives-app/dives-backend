import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1604829618416 implements MigrationInterface {
  name = "initial1604829618416";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TABLE "merchant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "ownerUserId" uuid, "ownerBudgetId" uuid, CONSTRAINT "PK_9a3850e0537d869734fc9bff5d6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "cycle_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "amount" money, "date" date NOT NULL, "period" integer NOT NULL, "description" character varying, "categoryId" uuid, "accountId" uuid, "budgetId" uuid, "merchantId" integer, "creatorId" uuid, CONSTRAINT "PK_b35202ffa7f65755c14a522b513" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "budget" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "limit" money, CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "budget_membership" ("accessLevel" character varying NOT NULL, "userId" uuid NOT NULL, "budgetId" uuid NOT NULL, CONSTRAINT "PK_9f23d83928e9d68d5003477e676" PRIMARY KEY ("userId", "budgetId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "debt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "currency" character varying NOT NULL, "interestRate" double precision, "endDate" date NOT NULL, "description" character varying, "balance" money NOT NULL, "iconUrl" character varying NOT NULL, "color" character varying NOT NULL, "ownerId" uuid, CONSTRAINT "PK_f0904ec85a9c8792dded33608a8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "action" character varying, "read" boolean NOT NULL, "time" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "plan" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" money NOT NULL, CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "price" money NOT NULL, "currency" character varying NOT NULL, "name" character varying NOT NULL, "userId" uuid, "planId" integer, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "birthDate" date NOT NULL, "country" character varying, "password" character varying NOT NULL, "photoUrl" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "limit" money, "type" integer NOT NULL, "iconUrl" character varying NOT NULL, "color" character varying NOT NULL, "ownerUserId" uuid, "ownerBudgetId" uuid, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "amount" money NOT NULL, "time" TIMESTAMP WITH TIME ZONE NOT NULL, "description" character varying, "categoryId" uuid, "accountId" uuid, "budgetId" uuid, "merchantId" integer, "creatorId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "currency" character varying NOT NULL, "description" character varying, "balance" money NOT NULL, "iconUrl" character varying NOT NULL, "color" character varying NOT NULL, "type" integer NOT NULL, "interestRate" double precision, "billingDate" date, "billingPeriod" integer, "ownerId" uuid, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "merchant" ADD CONSTRAINT "FK_f1ea7111b22e49d8c09a7917aa6" FOREIGN KEY ("ownerUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "merchant" ADD CONSTRAINT "FK_a986caecf3c941ebd3515f9221d" FOREIGN KEY ("ownerBudgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" ADD CONSTRAINT "FK_182e22ac7bf059beb0d0d138e3f" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" ADD CONSTRAINT "FK_f82a767d366a57fdfb5f5eb4f45" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" ADD CONSTRAINT "FK_1f8f035b4913979bc637788085f" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" ADD CONSTRAINT "FK_14db58c5251638870068f3e7c95" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" ADD CONSTRAINT "FK_8952f77db7ce00ba6c143b94274" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "budget_membership" ADD CONSTRAINT "FK_38890a25ba5f67ea8250f2722e7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "budget_membership" ADD CONSTRAINT "FK_1566b71ab838d920cfc9b00c46f" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "debt" ADD CONSTRAINT "FK_edded84017256ec78972458c3a3" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" ADD CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" ADD CONSTRAINT "FK_0e07e42c243fa9bd591053e20ec" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_bb075096e384d88dbc20addb304" FOREIGN KEY ("ownerUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_991622b94f152861ea32e158709" FOREIGN KEY ("ownerBudgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_d3951864751c5812e70d033978d" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_3d6e89b14baa44a71870450d14d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_6710c0ffac783e02b960c24bb61" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_3a4f348e34b2149ee21a7d5f93f" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_950cd07c2dae6a905eb8d1b0fc7" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_72719f338bfbe9aa98f4439d2b4" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_72719f338bfbe9aa98f4439d2b4"`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_950cd07c2dae6a905eb8d1b0fc7"`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_3a4f348e34b2149ee21a7d5f93f"`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_6710c0ffac783e02b960c24bb61"`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_3d6e89b14baa44a71870450d14d"`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_d3951864751c5812e70d033978d"`
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_991622b94f152861ea32e158709"`
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_bb075096e384d88dbc20addb304"`
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" DROP CONSTRAINT "FK_0e07e42c243fa9bd591053e20ec"`
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" DROP CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`
    );
    await queryRunner.query(`ALTER TABLE "debt" DROP CONSTRAINT "FK_edded84017256ec78972458c3a3"`);
    await queryRunner.query(
      `ALTER TABLE "budget_membership" DROP CONSTRAINT "FK_1566b71ab838d920cfc9b00c46f"`
    );
    await queryRunner.query(
      `ALTER TABLE "budget_membership" DROP CONSTRAINT "FK_38890a25ba5f67ea8250f2722e7"`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" DROP CONSTRAINT "FK_8952f77db7ce00ba6c143b94274"`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" DROP CONSTRAINT "FK_14db58c5251638870068f3e7c95"`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" DROP CONSTRAINT "FK_1f8f035b4913979bc637788085f"`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" DROP CONSTRAINT "FK_f82a767d366a57fdfb5f5eb4f45"`
    );
    await queryRunner.query(
      `ALTER TABLE "cycle_transaction" DROP CONSTRAINT "FK_182e22ac7bf059beb0d0d138e3f"`
    );
    await queryRunner.query(
      `ALTER TABLE "merchant" DROP CONSTRAINT "FK_a986caecf3c941ebd3515f9221d"`
    );
    await queryRunner.query(
      `ALTER TABLE "merchant" DROP CONSTRAINT "FK_f1ea7111b22e49d8c09a7917aa6"`
    );
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "purchase"`);
    await queryRunner.query(`DROP TABLE "plan"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "debt"`);
    await queryRunner.query(`DROP TABLE "budget_membership"`);
    await queryRunner.query(`DROP TABLE "budget"`);
    await queryRunner.query(`DROP TABLE "cycle_transaction"`);
    await queryRunner.query(`DROP TABLE "merchant"`);
  }
}
