import configration from './../configration';

class ImageService{
    POD_NO = 0;
    
    getUrl() {
        switch (this.POD_NO) {
            case 0:
              this.POD_NO = 1;
              return configration.SERVER_URL_1+"/fetch/image?url=";
            case 1:
              this.POD_NO = 2;
              return configration.IMAGE_URL+"/fetch/image?url=";
            case 2:
              this.POD_NO = 3;
              return configration.SERVER_URL_1+"/fetch/image?url=";
            case 3:
              this.POD_NO = 0;
              return configration.SERVER_URL_2+"/fetch/image?url=";
            default:
              return configration.SERVER_URL_1+"/fetch/image?url=";
          }
    }
}

const imageService = new ImageService();
export default imageService;