import {MigrationInterface, QueryRunner} from "typeorm";

export class length1654270302934 implements MigrationInterface {
    name = 'length1654270302934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`tag\` ADD \`name\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`comment\``);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`comment\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD \`name\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP COLUMN \`twitterImage\``);
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD \`twitterImage\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP COLUMN \`twitterImage\``);
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD \`twitterImage\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`comment\``);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`comment\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`tag\` ADD \`name\` varchar(255) NOT NULL`);
    }

}
