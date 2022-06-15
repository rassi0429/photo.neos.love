import {MigrationInterface, QueryRunner} from "typeorm";

export class timetodate1654095726871 implements MigrationInterface {
    name = 'timetodate1654095726871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`createDate\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`moment\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`moment\` ADD \`createDate\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`moment\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`moment\` ADD \`createDate\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`createDate\` decimal(10,0) NOT NULL DEFAULT '0'`);
    }

}
