import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { Moment } from './moment.entity';
import { Tag } from './tag.entity';
import { UserInfo } from './userinfo.entity';
import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { cloudflare } = require('../credentials/secrets.json');

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Moment)
    private momentRepository: Repository<Moment>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async getMomentByUserId(uid: string) {
    console.log('getMomentByUserId', uid);
    return this.momentRepository.find({
      where: { author: uid },
      relations: ['photos'],
      order: {
        id: 'DESC',
      },
    });
  }

  async getPhotoByUserId(uid: string) {
    console.log('getPhotoByUserId', uid);
    return this.photoRepository.find({
      where: { author: uid },
      relations: ['tags'],
      order: {
        id: 'DESC',
      },
    });
  }

  async getPhotoById(id: number) {
    return this.photoRepository.findOne({
      where: {
        id,
      },
      relations: ['tags'],
    });
  }

  async getCountInfo(uid: string) {
    const photo = await this.photoRepository.count({ where: { author: uid } });
    const moment = await this.momentRepository.count({
      where: { author: uid },
    });
    return { photo, moment };
  }

  async createMomentUseByPhotoId(
    uid: string,
    title: string,
    photoIds: number[],
  ) {
    const photos: Photo[] = [];
    for (const item of photoIds) {
      const photo = await this.photoRepository.findOne({ where: { id: item } });
      if (photo) photos.push(photo);
    }
    const moment = new Moment();
    moment.title = title;
    moment.author = uid;
    moment.photos = photos;
    moment.createDate = new Date();
    const m = await this.momentRepository.save(moment);
    this.generateMomentThumbnail(m).then(() => {
      this.generateTagsThumbnail();
    });
    return m;
  }

  async generateTagsThumbnail() {
    const tags = await this.tagRepository.find({ relations: ['photos'] });
    const noThumbnailTags = tags.filter(
      (t) => t.photos.length > 4 && !t.thumbnail,
    );
    try {
      for (const tag of noThumbnailTags) {
        console.log(tag.name);
        const canvas = createCanvas(1600, 900);
        const ctx = canvas.getContext('2d');
        const len = tag.photos.length >= 4 ? 4 : tag.photos.length;
        const imgs = [];
        for (let i = 0; i < len; i++) {
          imgs.push(
            await loadImage(tag.photos[i].url.replace('public', 'ogp')),
          );
        }
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (len == 4) {
          ctx.drawImage(imgs[0], 0, 0);
          ctx.drawImage(imgs[1], 800, 0);
          ctx.drawImage(imgs[2], 0, 450);
          ctx.drawImage(imgs[3], 800, 450);
        } else if (len == 3) {
          ctx.drawImage(imgs[2], 0, 0, 800, 450, 400, 0, 1600, 900);
          ctx.drawImage(imgs[0], 0, 0);
          ctx.drawImage(imgs[1], 0, 450);
        } else if (len == 2) {
          ctx.drawImage(imgs[0], 200, 0, 800, 450, 0, 0, 1600, 900);
          ctx.drawImage(imgs[1], 200, 0, 800, 450, 800, 0, 1600, 900);
        } else {
          ctx.drawImage(imgs[0], 0, 0, 800, 450, 0, 0, 1600, 900);
        }
        const directUploadUrl = await axios.post(
          `https://api.cloudflare.com/client/v4/accounts/${cloudflare.id}/images/v2/direct_upload`,
          null,
          { headers: { Authorization: `Bearer ${cloudflare.key}` } },
        );
        const url = directUploadUrl.data.result.uploadURL;
        const params = new FormData();
        params.append('file', canvas.toBuffer());
        const res = await axios.post(url, params, {
          headers: {
            ...params.getHeaders(),
            'Content-Length': params.getLengthSync(),
          },
        });
        tag.thumbnail = res.data.result.variants.filter((k) =>
          k.includes('public'),
        )[0];
        await this.tagRepository.save(tag);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async linkNeosAccess(userid: string, neosUserId: string) {
    const user = await this.userInfoRepository.findOne({
      where: { uid: userid },
    });
    if (neosUserId.startsWith('U-')) {
      return false;
    }
    if (user.neosId) {
      return false;
    } else {
      user.neosId = 'TMP-' + neosUserId;
      await this.userInfoRepository.save(user);
      return true;
    }
  }

  async generateMomentThumbnail(moment: Moment) {
    try {
      await this.sleep(5000);
      const canvas = createCanvas(1600, 900);
      const ctx = canvas.getContext('2d');
      const len = moment.photos.length >= 4 ? 4 : moment.photos.length;
      const imgs = [];
      for (let i = 0; i < len; i++) {
        imgs.push(
          await loadImage(moment.photos[i].url.replace('public', 'ogp')),
        );
      }

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (len == 4) {
        ctx.drawImage(imgs[0], 0, 0);
        ctx.drawImage(imgs[1], 800, 0);
        ctx.drawImage(imgs[2], 0, 450);
        ctx.drawImage(imgs[3], 800, 450);
      } else if (len == 3) {
        ctx.drawImage(imgs[2], 0, 0, 800, 450, 400, 0, 1600, 900);
        ctx.drawImage(imgs[0], 0, 0);
        ctx.drawImage(imgs[1], 0, 450);
      } else if (len == 2) {
        ctx.drawImage(imgs[0], 200, 0, 800, 450, 0, 0, 1600, 900);
        ctx.drawImage(imgs[1], 200, 0, 800, 450, 800, 0, 1600, 900);
      } else {
        ctx.drawImage(imgs[0], 0, 0, 800, 450, 0, 0, 1600, 900);
      }
      const directUploadUrl = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflare.id}/images/v2/direct_upload`,
        null,
        { headers: { Authorization: `Bearer ${cloudflare.key}` } },
      );
      const url = directUploadUrl.data.result.uploadURL;
      const params = new FormData();
      params.append('file', canvas.toBuffer());
      const res = await axios.post(url, params, {
        headers: {
          ...params.getHeaders(),
          'Content-Length': params.getLengthSync(),
        },
      });
      moment.thumbnail = res.data.result.variants.filter((k) =>
        k.includes('public'),
      )[0];
      return this.momentRepository.save(moment);
    } catch (e) {
      console.log(e);
    }
  }

  async getMomentById(momentId: number) {
    return this.momentRepository.findOne({
      where: { id: momentId },
      relations: ['photos', 'photos.tags'],
    });
  }

  async getPhotoByTag(tag: string, order?: string, limit = 0, page = 0) {
    const result = await this.tagRepository.findOne({
      where: { name: tag },
      relations: [`photos`, `photos.tags`],
    });
    if (!result) return null;
    if (order !== 'ASC') {
      result.photos = result.photos.reverse();
    }
    if (limit || page) {
      result.photos = result.photos.slice(page * limit, (page + 1) * limit);
    }
    return result;
  }

  async getTags() {
    const result = await this.tagRepository.find();
    return result;
  }

  async updatePhotoById(id, comment, tags) {
    const photo = await this.photoRepository.findOne({ where: { id } });
    const newTags = [];
    for (const item of tags) {
      const t = await this.tagRepository.findOne({ name: item });
      if (t) {
        newTags.push(t);
      } else {
        const newTag = new Tag();
        newTag.name = item;
        const tag = await this.tagRepository.save(newTag);
        newTags.push(tag);
      }
    }
    photo.comment = comment;
    photo.tags = newTags;
    return this.photoRepository.save(photo);
  }

  async getPhotos(limit: number, page: number, tags: string[], user: string) {
    let photos = [];
    if (tags.length !== 0) {
      console.log('tag');
      const tag = this.tagRepository.findOne({ where: { name: 'NULL' } });
      photos = await this.photoRepository.find({
        take: limit,
        skip: limit * page,
        where: { tags: In([tag]) },
        relations: ['tags'],
        order: {
          id: 'DESC',
        },
      });
    } else if (user) {
      photos = await this.photoRepository.find({
        take: limit,
        skip: limit * page,
        where: {
          author: user,
        },
        relations: ['tags'],
        order: {
          id: 'DESC',
        },
      });
    } else {
      photos = await this.photoRepository.find({
        take: limit,
        skip: limit * page,
        relations: ['tags'],
        order: {
          id: 'DESC',
        },
      });
    }
    return photos;
  }

  async addPhoto(url: string, comment: string, author: string, tags: string[]) {
    const newPhoto = new Photo();
    newPhoto.url = url;
    newPhoto.comment = comment;
    newPhoto.author = author;
    newPhoto.createDate = new Date();
    newPhoto.tags = [];
    for (const item of tags) {
      const t = await this.tagRepository.findOne({ name: item });
      if (t) {
        newPhoto.tags.push(t);
      } else {
        const newTag = new Tag();
        newTag.name = item;
        const tag = await this.tagRepository.save(newTag);
        newPhoto.tags.push(tag);
      }
    }
    return this.photoRepository.save(newPhoto);
  }

  async deletePhoto(id: number) {
    const photo = await this.photoRepository.findOne({ where: { id } });
    return this.photoRepository.remove(photo);
  }

  async createMoment(title: string, author: string, photo: Photo[]) {
    const newMoment = new Moment();
    newMoment.title = title;
    newMoment.author = author;
    newMoment.photos = [...photo];
    return this.momentRepository.save(newMoment);
  }

  async updateUserInfo(uid, twitterId, name, iconUrl) {
    let user = await this.userInfoRepository.findOne({ where: { uid } });
    if (!user) user = new UserInfo();
    user.uid = uid;
    user.twitterId = twitterId;
    user.name = name;
    user.twitterImage = iconUrl;
    return this.userInfoRepository.save(user);
  }

  async getUserInfo(uid) {
    return this.userInfoRepository.findOne({ where: { uid } });
  }
}
