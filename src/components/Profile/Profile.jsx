import React from "react";
import styled from "styled-components";
import "./Profile.css";
import { KeyNumbers } from "../key-numbers";
import * as Icons from "../icons";
const Profile = () => {
  return (
    <div class="Header">
      <div class="HeaderWrap">
        <div class="ProfilePic">
          <div class="ProfileImg">
            <img
              src="./Image/mate1.png"
              class="gallery-item"
              alt="gallery"
            ></img>
          </div>
        </div>
        <div>
          <div class="ProfileRow">
            <div class="ProfileTitle">
              <div class="ProfileName">apple</div>
              <div class="ProfileIcon"><Icons.Verified/></div>
              <div class="ProfileButton">
                <button type="button" class="btn btn-primary Button">
                  Follow
                </button>
              </div>
            </div>
          </div>
          <div class="DesktopOnly">
            <div class="ProfileRow"><KeyNumbers/></div>
            <div class="ProfileDescriptionsA">
            <div class="ProfileDescription">apple</div>
            <div class="ProfileDescriptionSpan">
              Everyone has a story to tell you
              <br />
              Tag <strong class="ProfileDescriptionA">#ShotonNFT</strong> to take part
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
