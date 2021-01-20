import {MigrationInterface, QueryRunner} from "typeorm";

export class addToken1611149526215 implements MigrationInterface {
    name = 'addToken1611149526215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "token" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_a854e557b1b14814750c7c7b0c9" UNIQUE ("token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_a854e557b1b14814750c7c7b0c9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token"`);
    }

}
