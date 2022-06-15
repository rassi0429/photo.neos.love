import {MigrationInterface, QueryRunner} from "typeorm";

export class tagThumbnail1654394990088 implements MigrationInterface {
    name = 'tagThumbnail1654394990088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tag\` ADD \`thumbnail\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`thumbnail\``);
    }

}
