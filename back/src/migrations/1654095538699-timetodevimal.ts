import {MigrationInterface, QueryRunner} from "typeorm";

export class timetodevimal1654095538699 implements MigrationInterface {
    name = 'timetodevimal1654095538699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`createDate\` decimal NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`moment\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`moment\` ADD \`createDate\` decimal NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`moment\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`moment\` ADD \`createDate\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`createDate\` int NOT NULL DEFAULT '0'`);
    }

}
