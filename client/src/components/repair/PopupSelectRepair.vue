<template>
  <div id="popup-container">
    <!-- PRODUCT-DIV -->
    <div class="product-container">
      <div class="product-section">
        <h1>Product</h1>
        <div id="popup-static-product-style">
          <img
            src="@/assets/images/parts/sunbellProductImage.png"
            alt="Product: Sunbell"
          />
          <h2>Sunbell</h2>
        </div>
      </div>

      <div class="serial-section">
        <label for="srn" class="h3">Serial number</label>

        <input
          id="srn"
          ref="inputSerialNumber"
          v-on:keydown="serialInputIsEmpty = false"
          v-bind:class="{ serialInputEmpty: serialInputIsEmpty }"
          type="text"
          :v-model="serialNr"
          placeholder="Example: 1234 5678"
          :tabindex="tabindex + 1"
        />
      </div>
    </div>
    <!-- Error Message 1 Button-->
    <modal-error-message v-if="showModal === true" @close="showModal = false">
      <template v-slot:body>{{ modalTextBody }}</template>
    </modal-error-message>
    <!-- No Serial Number Message 2 Buttons-->
    <modal-no-serial-number-message
      v-if="showNoSerialModal === true"
      @commit="(noSerialNumberCommitted = true), submitPartsSelected()"
      @close="showNoSerialModal = false"
    >
      <template v-slot:body>{{ modalTextBody }}</template>
    </modal-no-serial-number-message>
    <!-- PARTS-DIV -->
    <div class="part-container">
      <h1>Parts</h1>
      <div id="parts-cont-no-change" class="part-grid">
        <div
          class="part-grid-entity"
          v-for="product in productImages"
          :key="product.partNumber"
          @click="selectPart(product)"
          @keydown.enter="selectPart(product)"
          :tabindex="tabindex + 1"
        >
          <img
            class="part-icon"
            :class="{ partchecked: product.isChecked }"
            :id="product.partNumber"
            :src="require('@/assets/images/parts/' + product.imgName + '.png')"
            alt="{{product.partName}}"
          />
          <h2>{{ product.partName }}</h2>
        </div>
      </div>
      <div class="close-container-ic">
        <button
          type="button"
          v-on:click="closePopup"
          @keydown.enter="closePopup"
          :tabindex="tabindex + 1"
        >
          <icon-base
            class="close-repair-ic"
            iconName="cross"
            iconColor="#C93333"
            icon-hover-color="#A80000"
            iconWidth="100%"
            iconHeight="100%"
          />
          <span class="sr-only">Cancel</span>
        </button>
      </div>
    </div>
    <div class="submit-container-ic">
      <button
        type="button"
        @click="submitPartsSelected"
        @keydown.enter="submitPartsSelected"
        :tabindex="tabindex + 1"
      >
        <icon-base
          class="submit-ic"
          iconName="checkmark"
          iconColor="#6A975A"
          icon-hover-color="#006400"
          iconWidth="100%"
          iconHeight="100%"
        />
        <span class="sr-only">Proceed</span>
      </button>
    </div>
  </div>
</template>

<script>
import ModalErrorMessage from "@/components/modals/ModalErrorMessage.vue";
import ModalNoSerialNumberMessage from "@/components/modals/ModalNoSerialNumberMessage.vue";
import IconBase from "../ui/IconBase.vue";

export default {
  name: "PopupSelect",
  emits: ["onClose", "onCloseRepair"],
  components: {
    ModalErrorMessage,
    ModalNoSerialNumberMessage,
    IconBase
  },
  props: {
    tabindex: {
      type: Number,
      required: false,
      default: 1
    }
  },
  data() {
    return {
      serialInputIsEmpty: false,
      modalTextBody: "",
      showModal: false,
      showNoSerialModal: false,
      noSerialNumberCommitted: false,
      serialNr: {
        Type: Number,
        Required: true
      },
      productImages: [
        {
          partNumber: "1",
          partName: "Lamp",
          imgName: "ic-part-lamp",
          isChecked: false
        },
        {
          partNumber: "2",
          partName: "12V charger",
          imgName: "ic-part-adapter-charger",
          isChecked: false
        },
        {
          partNumber: "3",
          partName: "Battery",
          imgName: "ic-part-battery",
          isChecked: false
        },
        {
          partNumber: "4",
          partName: "Power button",
          imgName: "ic-part-button",
          isChecked: false
        },
        {
          partNumber: "5",
          partName: "Light bulb",
          imgName: "ic-part-lightbulb",
          isChecked: false
        },
        {
          partNumber: "6",
          partName: "Screen",
          imgName: "ic-part-screen",
          isChecked: false
        },
        {
          partNumber: "7",
          partName: "Socket charger",
          imgName: "ic-part-socket-charger",
          isChecked: false
        },
        {
          partNumber: "8",
          partName: "Solar panel",
          imgName: "ic-part-solar-panel",
          isChecked: false
        }
      ],
      partsChosen: []
    };
  },
  methods: {
    selectPart(product) {
      product.isChecked = !product.isChecked; // Flips the boolean value, true->false, false->true
    },
    submitPartsSelected() {
      // Adding the marked parts to the partsChosen-array
      for (let i = 0; i < this.productImages.length; i++) {
        if (this.productImages[i].isChecked) {
          this.partsChosen.push(this.productImages[i]);
        }
      }

      const serialNr = this.$refs.inputSerialNumber.value.trim();

      if (serialNr.length > 20) {
        // Serial number too long
        this.modalTextBody = "Serial number length must be less than 20";
        this.showModal = true;
        return;
      } else if (isNaN(serialNr)) {
        // Serial number must be numeric
        this.modalTextBody = "Serial number can only contain numbers";
        this.showModal = true;
        return;
      } else if (this.partsChosen.length === 0) {
        // Please choose part
        this.modalTextBody = "Please Select parts";
        this.showModal = true;
        return;
      } else if (serialNr === "" && !this.noSerialNumberCommitted) {
        // No serial number provided
        this.partsChosen = [];
        this.serialInputIsEmpty = true;
        this.modalTextBody = "Are you sure you have no serial number?";
        this.showNoSerialModal = true;
        this.noSerialNumberCommitted = false;
        return;
      }

      const stateEntities = this.$store.getters.getEntities;

      // Get first available unique id
      let newId = 0;
      const takenIds = [];
      for (let i = 0; i < stateEntities.length; i++) {
        takenIds[stateEntities[i].id] = true;
      }
      for (let i = 0; i <= stateEntities.length; i++) {
        if (!takenIds[i]) {
          newId = i;
          break;
        }
      }

      //Creates object which later is injected into Vue state
      const newEntity = {
        id: newId,
        entitySerialNr: serialNr,
        parts: this.partsChosen
      };

      this.serialInputIsEmpty = true;
      this.$store.commit("addEntity", newEntity);
      this.closePopup();
    },
    closePopup() {
      this.$emit("onCloseRepair");
    }
  }
};
</script>
<style lang="scss" scoped>
#popup-container {
  width: 100%;
  height: 100%;
  user-select: none;
  text-align: center;
  background-color: #f8f6f2;
  display: grid;
  grid-template-columns: auto 70%;
  border-radius: 10px;

  h1 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0;
    color: #38293c;
  }

  .product-container {
    border-right: 1px solid black;
    // Creating grid for products-container to
    // position both product and serial number
    display: grid;
    height: 100%;
    grid-template-rows: 80% 20%;

    .product-section {
      border-bottom: 1px solid black;
      display: flex;
      flex-direction: column;
      padding: 10px;
    }

    #popup-static-product-style {
      background-color: #7eb46b;
      width: 15vh;
      height: 15vh;
      margin: auto;
      border-radius: 10px;

      h2 {
        font-weight: bold;
        font-size: 17px;
      }

      img {
        -webkit-user-drag: none;
        cursor: default;
      }
    }

    .serial-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      h1 {
        position: relative;
        color: #38293c;
      }

      .serialInputEmpty {
        box-shadow: 0 0 8px #cc0000;
      }

      input {
        border: 1.5px solid #423048;
        border-radius: 5px;
        background-color: #fffefd;
        color: #050505;
        text-align: center;
        font-weight: bold;
        font-style: italic;
        outline: none;
      }
    }
  }

  .part-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f6f2;
    padding: 10px;
    border-radius: 10px;

    .part-grid {
      height: 80%;
      width: 100%;
      margin: 10px 0 10px 0;
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      justify-items: center;

      grid-template-columns: repeat(4, minmax(0, 1fr));
      grid-template-rows: repeat(2, minmax(0, 1fr));
      gap: 0 20px;
    }

    .part-grid-entity {
      display: flex;
      flex-direction: column;
      cursor: pointer;

      width: 80%;
      height: 80%;

      &:hover img {
        background: #7eb46b;
      }

      .part-icon {
        border-radius: 10px;
        background-color: #dad2cb;
        flex: 1;
        align-self: center;
        -webkit-user-drag: none;
      }

      h2 {
        cursor: pointer;
        font-weight: bold;
        font-size: 1rem;
      }
    }

    .part-grid-entity .partchecked {
      background-color: #7eb46b;
    }
  }

  .submit-container-ic {
    width: 50px;
    height: 50px;
    position: absolute;
    right: 10px;
    bottom: 0px;

    .submit-ic {
      cursor: pointer;
      height: 50px;
    }
  }

  .close-container-ic {
    width: 35px;
    height: 35px;
    position: absolute;
    right: 10px;
    top: 10px;

    .close-repair-ic {
      cursor: pointer;
      width: 35px;
      height: 35px;
    }
  }
}

@media only screen and (min-device-width: 600px) and (max-width: 1280px) and (orientation: landscape) {
  #popup-container {
    height: 54vh;

    h1 {
      font-size: 1.2rem;
    }

    .product-container {
      width: 30vh;
      grid-template-rows: 70% 30%;

      .product-section {
        width: 30vh;
      }

      #popup-static-product-style {
        h2 {
          font-size: 14px;
        }
      }

      .serial-section {
        h1 {
          font-size: 14px;
        }

        input {
          width: 85%;
          font-size: 10px;
        }
      }
    }

    .part-container {
      margin: auto;
      width: 65vh;
      height: 50vh;

      .part-grid {
        gap: 0 5px;
      }

      .part-grid-entity {
        h2 {
          font-size: 0.6rem;
        }
      }
    }

    .submit-container-ic {
      width: 25px;
      height: 25px;
      position: absolute;
      bottom: 10px;

      .submit-ic {
        width: 25px;
        height: 25px;
      }
    }

    .close-container-ic {
      width: 20px;
      height: 20px;

      .close-repair-ic {
        width: 20px;
        height: 20px;
      }
    }
  }
}

/*
https://www.smashingmagazine.com/2021/03/complete-guide-accessible-front-end-components/#accessible-close-buttons
*/
.sr-only {
  position: absolute;
  white-space: nowrap;
  width: 1px;
  height: 1px;
  overflow: hidden;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  margin: -1px;
}

.h3 {
  display: block;
  font-size: 1.1em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
}
</style>
