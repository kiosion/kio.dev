import React, { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';

import { portableTextComponents } from '../../PortableText';
//import Hover from '../../Utils/Hover/Hover';
import { client } from '../../../client';

import './AboutSection.scss';
const AboutSection = (props: any) => {
  const [about, setAbout] = useState<any>([]);
  const [aboutBody, setAboutBody] = useState<any>([]);

  useEffect(() => {
    const query = `*[_type == "author" && slug.current == "kio"]{
            name,
            slug,
            "image": image.asset->url,
            bio,
            body,
        }`;

    client
      .fetch(query)
      .then((res) => {
        setAbout(res);
        setAboutBody(res[0]?.body);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  }, []);

  return (
    <div className="app__aboutSection">
      <div className="app__section-title">About</div>
      <div className="aboutSection__aboutContent">

        <div className="content__body">
          {(aboutBody) ? (
            <PortableText
              value={aboutBody}
              components={portableTextComponents}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
                
      </div>
      <div className="app__section-divider"></div>
    </div>
  );
};

export default AboutSection;
