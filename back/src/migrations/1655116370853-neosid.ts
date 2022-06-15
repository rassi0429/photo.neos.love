import {MigrationInterface, QueryRunner} from "typeorm";

export class neosid1655116370853 implements MigrationInterface {
    name = 'neosid1655116370853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD \`neosId\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP COLUMN \`neosId\``);
    }

}
