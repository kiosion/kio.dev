import type { PTBlock } from '$lib/types';

export const postBody = [
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: 'This is a test! Just adding some more text here to test.',
        marks: [],
        _type: 'span',
        _key: '37497b7aa4b1'
      }
    ],
    _type: 'block',
    _key: '1650f5e3ff0b'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: 'sfkjhgdsfkhjdfx',
        marks: [],
        _type: 'span',
        _key: '066229c4cfed'
      }
    ],
    _type: 'block',
    _key: '7cdb0fd5f3e4'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: 'Some ',
        marks: [],
        _type: 'span',
        _key: '5af92993b89e'
      },
      {
        text: 'italic',
        marks: ['em'],
        _type: 'span',
        _key: '87efa8d5e76b'
      },
      {
        text: ' and ',
        marks: [],
        _type: 'span',
        _key: '6e2ffa8b9fe6'
      },
      {
        text: 'bold',
        marks: ['strong'],
        _type: 'span',
        _key: '52611fb52d87'
      },
      {
        text: ' text, also ',
        marks: [],
        _type: 'span',
        _key: '75b422ebb476'
      },
      {
        text: 'underlined',
        marks: ['underline'],
        _type: 'span',
        _key: '29dab602e764'
      },
      {
        text: '!',
        marks: [],
        _type: 'span',
        _key: 'd359e7799f1d'
      }
    ],
    _type: 'block',
    _key: '1c1f6ca0219b'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: '3c95bd493528'
      }
    ],
    _type: 'block',
    _key: 'd0b3b022ae3d'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: 'Screw it, ',
        marks: [],
        _type: 'span',
        _key: 'ae5655e9bc06'
      },
      {
        text: 'highlighted text too',
        marks: ['highlight'],
        _type: 'span',
        _key: 'ab8b870d0b61'
      },
      {
        text: '...',
        marks: [],
        _type: 'span',
        _key: '0579d7efda39'
      }
    ],
    _type: 'block',
    _key: '49ab94af30c4'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: 'df11fd109849'
      }
    ],
    _type: 'block',
    _key: 'af1773e0eeb0'
  },
  {
    style: 'h3',
    markDefs: [],
    children: [
      {
        text: 'Maybe a Section Title',
        marks: ['strong'],
        _type: 'span',
        _key: '9e86ed35bcee'
      }
    ],
    _type: 'block',
    _key: 'ba988c294523'
  },
  {
    style: 'normal',
    markDefs: [
      {
        href: 'https://github.com/kiosion/portfolio',
        _type: 'link',
        _key: 'dec72015923c'
      }
    ],
    children: [
      {
        text: 'Followed by another paragraph, and a ',
        marks: [],
        _type: 'span',
        _key: '4472d5ae5c1a'
      },
      {
        text: 'handy little link',
        marks: ['dec72015923c'],
        _type: 'span',
        _key: 'c7944b0abd23'
      },
      {
        text: ' to the GH repo.',
        marks: [],
        _type: 'span',
        _key: '5d4727babda1'
      }
    ],
    _type: 'block',
    _key: '1928391b1434'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: '36d3f39ea4d0'
      }
    ],
    _type: 'block',
    _key: '5f6557f0b4ae'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: 'fd9d6031508a'
      }
    ],
    _type: 'block',
    _key: '78facbf49c20'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: "How about some code? Here's an example:",
        marks: [],
        _type: 'span',
        _key: '538cf5ba7794'
      }
    ],
    _type: 'block',
    _key: '0971726f804f'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: 'f99b8526bcd3'
      }
    ],
    _type: 'block',
    _key: 'f6f834d85a7d'
  },
  {
    language: 'javascript',
    code: "const portableTextComponents:PortableTextComponents = {\n    marks: {\n        link: ({ value, children }) => {\n            const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;\n            return (\n                <Hover>\n                    <a href={value?.href} target={target} rel={target === '_blank' ? 'noindex nofollow' : ''}>\n                        {children}\n                    </a>\n                </Hover>\n            );\n        },\n    },\n}",
    _type: 'code',
    _key: 'fd44b962de4e'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: 'b2a0c45cb229'
      }
    ],
    _type: 'block',
    _key: 'dcdb2d626752'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '// Followed by some inline code!',
        marks: ['code'],
        _type: 'span',
        _key: '70a66a0e0ffa'
      }
    ],
    _type: 'block',
    _key: '72df0f7fb244'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: '9752682954ca'
      }
    ],
    _type: 'block',
    _key: '5a52efdf0b21'
  },
  {
    style: 'divider',
    _type: 'divider',
    _key: 'dcf80bf0da6d'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: 'a7b330682574'
      }
    ],
    _type: 'block',
    _key: 'd074069dc744'
  },
  {
    style: 'break',
    _type: 'divider',
    _key: '1f5e120a30d0'
  },
  {
    style: 'h1',
    markDefs: [],
    children: [
      {
        text: 'Heading 1',
        marks: [],
        _type: 'span',
        _key: '1e1291a6cda8'
      }
    ],
    _type: 'block',
    _key: 'd942bba972f2'
  },
  {
    style: 'h2',
    markDefs: [],
    children: [
      {
        text: 'Heading 2',
        marks: [],
        _type: 'span',
        _key: '76e86048b036'
      }
    ],
    _type: 'block',
    _key: '566552cff644'
  },
  {
    style: 'h3',
    markDefs: [],
    children: [
      {
        text: 'Heading 3',
        marks: [],
        _type: 'span',
        _key: '02b804c6d4bb'
      }
    ],
    _type: 'block',
    _key: 'ac599de06973'
  },
  {
    style: 'h4',
    markDefs: [],
    children: [
      {
        text: 'Heading 4',
        marks: [],
        _type: 'span',
        _key: 'ecee2736aaff'
      }
    ],
    _type: 'block',
    _key: '533ae1f3d67d'
  },
  {
    style: 'h5',
    markDefs: [],
    children: [
      {
        text: 'Heading 5',
        marks: [],
        _type: 'span',
        _key: '1c785fdd2500'
      }
    ],
    _type: 'block',
    _key: '37b5866fa213'
  },
  {
    style: 'h6',
    markDefs: [],
    children: [
      {
        text: 'Heading 6 (really more of a caption)',
        marks: [],
        _type: 'span',
        _key: 'fc4503cc874d'
      }
    ],
    _type: 'block',
    _key: '0bb9557af7f8'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: 'b3fb4a0dc92e'
      }
    ],
    _type: 'block',
    _key: '1c8990465848'
  },
  {
    style: 'h2',
    markDefs: [],
    children: [
      {
        text: 'Another large heading',
        marks: [],
        _type: 'span',
        _key: '7daa63ca8b14'
      }
    ],
    _type: 'block',
    _key: '2c9d9a98df54'
  },
  {
    style: 'h3',
    markDefs: [],
    children: [
      {
        text: 'Followed by a smaller one',
        marks: [],
        _type: 'span',
        _key: '310c89ae4cfe'
      }
    ],
    _type: 'block',
    _key: 'ac0da243c870'
  },
  {
    style: 'h2',
    markDefs: [],
    children: [
      {
        text: 'Then larger again!',
        marks: [],
        _type: 'span',
        _key: '1ed1c551d57d'
      }
    ],
    _type: 'block',
    _key: '59421bd8be8e'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: 'f096f2444bf7'
      }
    ],
    _type: 'block',
    _key: '14570e7010f1'
  },
  {
    style: 'blockquote',
    markDefs: [],
    children: [
      {
        text: 'And a blockquote',
        marks: [],
        _type: 'span',
        _key: '91f84f62f8b9'
      }
    ],
    _type: 'block',
    _key: 'b0d8304b6e27'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: '93015ea23517'
      }
    ],
    _type: 'block',
    _key: '70a1d6c2f18b'
  },
  {
    style: 'blockquote',
    markDefs: [],
    children: [
      {
        text: "Followed by a blockquote that's\nMultiple lines\nMaybe a speech or poem? Could be a haiku. Idk.",
        marks: [],
        _type: 'span',
        _key: '07a4b56482d5'
      }
    ],
    _type: 'block',
    _key: '32a09ec13a81'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: '5b9f0e86f8c0'
      }
    ],
    _type: 'block',
    _key: '165a17c8bac7'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: 'Adding even more content down here in order to test page scrolling, and make sure that my footer actually sticks to the bottom of articles on pages that behaviour is enabled for.',
        marks: [],
        _type: 'span',
        _key: 'a238401d3746'
      }
    ],
    _type: 'block',
    _key: '856bb22c4b54'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: '',
        marks: [],
        _type: 'span',
        _key: '50cdd97e74db'
      }
    ],
    _type: 'block',
    _key: '4f62a0947088'
  },
  {
    style: 'normal',
    markDefs: [],
    children: [
      {
        text: "Let's see!",
        marks: [],
        _type: 'span',
        _key: '88cdcb749f32'
      }
    ],
    _type: 'block',
    _key: '62adcef3b2f6'
  }
] as PTBlock[];
