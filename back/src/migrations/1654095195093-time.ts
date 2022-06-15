import {MigrationInterface, QueryRunner} from "typeorm";

export class time1654095195093 implements MigrationInterface {
    name = 'time1654095195093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`moment\` ADD \`createDate\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`moment\` DROP COLUMN \`createDate\``);
    }

}
