import {MigrationInterface, QueryRunner} from "typeorm";

export class tag1653914227065 implements MigrationInterface {
    name = 'tag1653914227065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`photo_tags_tag\` (\`photoId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_abc691581585594116ae7254bf\` (\`photoId\`), INDEX \`IDX_a74f4c3885bff109e0f691f19f\` (\`tagId\`), PRIMARY KEY (\`photoId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`photo_tags_tag\` ADD CONSTRAINT \`FK_abc691581585594116ae7254bfe\` FOREIGN KEY (\`photoId\`) REFERENCES \`photo\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`photo_tags_tag\` ADD CONSTRAINT \`FK_a74f4c3885bff109e0f691f19fd\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`photo_tags_tag\` DROP FOREIGN KEY \`FK_a74f4c3885bff109e0f691f19fd\``);
        await queryRunner.query(`ALTER TABLE \`photo_tags_tag\` DROP FOREIGN KEY \`FK_abc691581585594116ae7254bfe\``);
        await queryRunner.query(`DROP INDEX \`IDX_a74f4c3885bff109e0f691f19f\` ON \`photo_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_abc691581585594116ae7254bf\` ON \`photo_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`photo_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
    }

}
