defmodule TestFixtures do
  def stub_about() do
    %{
      :query => "*[!(_id in path('drafts.**')) && _id == 'me'][0]",
      :result => %{
        "_createdAt" => "2022-12-01T20:22:21Z",
        "_id" => "me",
        "_rev" => "YzGOS5evnRAqo4PtxClxpz",
        "_type" => "author",
        "_updatedAt" => "2023-05-09T20:00:02Z",
        "at" => "kiosion",
        "bio" => [
          %{
            "_key" => "74cc5ec7b46b",
            "_type" => "block",
            "children" => [
              %{
                "_key" => "8fead2de75ff",
                "_type" => "span",
                "marks" => [],
                "text" => "Wow, some stub PortableText content, how interesting."
              }
            ],
            "markDefs" => [],
            "style" => "normal"
          }
        ],
        "body" => [
          %{
            "_key" => "881c0710f3dd",
            "_type" => "block",
            "children" => [
              %{
                "_key" => "9cf58619c1cd",
                "_type" => "span",
                "marks" => [],
                "text" => "And some more."
              }
            ],
            "markDefs" => [],
            "style" => "normal"
          }
        ],
        "contact" => [
          %{
            "_key" => "780ae558846e",
            "_type" => "block",
            "children" => [
              %{
                "_key" => "c6e96728a45e",
                "_type" => "span",
                "marks" => [],
                "text" => "That's all."
              }
            ],
            "markDefs" => [],
            "style" => "normal"
          }
        ],
        "fullname" => "uisyslkdfhj",
        "image" => %{
          "_type" => "image",
          "asset" => %{
            "_ref" => "image-7b9e5cf017754bff4e8627a8e55dcd8cfb9c587c-4096x1854-jpg",
            "_type" => "reference"
          },
          "crop" => %{
            "_type" => "sanity.imageCrop",
            "bottom" => 0.2500303067038435,
            "left" => 0.21404109589041126,
            "right" => 0.577054794520546,
            "top" => 0.4432355437022675
          },
          "hotspot" => %{
            "_type" => "sanity.imageHotspot",
            "height" => 0.13625894047763232,
            "width" => 0.0582191780821919,
            "x" => 0.31164383561643844,
            "y" => 0.5757667596072251
          }
        },
        "name" => "Kio"
      },
      :ms => 1
    }
  end

  def stub_config() do
    %{
      :query => "*[!(_id in path('drafts.**')) && _type == 'siteSettings'][0]",
      :result => %{
        "_type" => "siteSettings",
        "pgpKey" => "asdf",
        "me" => %{
          "_type" => "reference",
          "_ref" => "me"
        },
        "_updatedAt" => "2023-02-20T00:30:59Z",
        "pinnedPost" => %{
          "_type" => "reference",
          "_ref" => "1234"
        },
        "pinnedProject" => %{
          "_type" => "reference",
          "_ref" => "4321"
        },
        "_id" => "siteSettings",
        "socialLinks" => [
          %{
            "internal" => false,
            "iconRotation" => 0,
            "icon" => "fa-brands:twitter",
            "name" => "Twitter",
            "rel" => [
              "nofollow"
            ],
            "iconSize" => 18,
            "_key" => "4b554b2e37a2",
            "url" => "https://twitter.com/0xKI0"
          },
          %{
            "icon" => "fa-brands:github",
            "name" => "Github",
            "rel" => [
              "nofollow"
            ],
            "iconSize" => 20,
            "_key" => "d2d628660c92",
            "url" => "https://github.com/kiosion",
            "internal" => false,
            "iconRotation" => 0
          }
        ],
        "_createdAt" => "2022-08-27T00:49:57Z"
      },
      :ms => 1
    }
  end

  def stub_posts_count() do
    %{
      :query =>
        "{ 'total': count(*[!(_id in path('drafts.**')) && _type == 'post']{_id, 'objectID':_id, _rev, _type, title, publishedAt, 'author':{'_id':author->_id, '_type':author->_type, 'name':author->name, 'slug':author->slug, 'image':author->image}, tags[]->{_id, title, slug}, slug, body, desc, date, 'numberOfCharacters':length(pt::text(body)), 'estimatedWordCount':round(length(pt::text(body)) / 5), 'estimatedReadingTime':round(length(pt::text(body)) / 5 / 120)}), 'count': count(*[!(_id in path('drafts.**')) && _type == 'post']{_id, 'objectID':_id, _rev, _type, title, publishedAt, 'author':{'_id':author->_id, '_type':author->_type, 'name':author->name, 'slug':author->slug, 'image':author->image}, tags[]->{_id, title, slug}, slug, body, desc, date, 'numberOfCharacters':length(pt::text(body)), 'estimatedWordCount':round(length(pt::text(body)) / 5), 'estimatedReadingTime':round(length(pt::text(body)) / 5 / 120)} | order(date desc) [0...10])}",
      :result => %{
        "total" => 1,
        "count" => 1
      },
      :ms => 1
    }
  end

  def stub_posts() do
    %{
      :query =>
        "*[!(_id in path('drafts.**')) && _type == 'post']{_id, 'objectID':_id, _rev, _type, title, publishedAt, 'author':{'_id':author->_id, '_type':author->_type, 'name':author->name, 'slug':author->slug, 'image':author->image}, tags[]->{_id, title, slug}, slug, body, desc, date, 'numberOfCharacters':length(pt::text(body)), 'estimatedWordCount':round(length(pt::text(body)) / 5), 'estimatedReadingTime':round(length(pt::text(body)) / 5 / 120)} | order(date desc) [0...10]",
      :result => [
        %{
          "estimatedWordCount" => 11,
          "_type" => "post",
          "tags" => nil,
          "slug" => %{
            "_type" => "slug",
            "current" => "some-post"
          },
          "date" => "2022-08-26",
          "numberOfCharacters" => 55,
          "_id" => "b0a22943-b747-42df-84cd-573503332428",
          "_rev" => "DFeMJDW0bXSE9MGpOVLqKO",
          "title" => "Some post",
          "objectID" => "b0a22943-b747-42df-84cd-573503332428",
          "publishedAt" => nil,
          "author" => %{
            "image" => %{
              "hotspot" => %{
                "y" => 0.5757667596072251,
                "height" => 0.13625894047763232,
                "_type" => "sanity.imageHotspot",
                "width" => 0.0582191780821919,
                "x" => 0.31164383561643844
              },
              "_type" => "image",
              "asset" => %{
                "_ref" => "image-7b9e5cf017754bff4e8627a8e55dcd8cfb9c587c-4096x1854-jpg",
                "_type" => "reference"
              },
              "crop" => %{}
            },
            "_id" => "me",
            "_type" => "author",
            "name" => "Kio",
            "slug" => nil
          },
          "body" => [
            %{
              "markDefs" => [],
              "children" => [
                %{
                  "text" => "This post now has actual body content! Revolutionary...",
                  "_key" => "f231f8e8847b",
                  "_type" => "span",
                  "marks" => []
                }
              ],
              "_type" => "block",
              "style" => "normal",
              "_key" => "cda99f79ba00"
            }
          ],
          "desc" => "Something interesting",
          "estimatedReadingTime" => 0
        }
      ],
      :ms => 1
    }
  end

  def mixed_headings() do
    [
      %{
        "_type" => "block",
        "_key" => "e7030c8c5faa",
        "style" => "normal",
        "markDefs" => [],
        "children" => [
          %{
            "_type" => "span",
            "_key" => "a65907d2f969",
            "marks" => [],
            "text" => "Some normal text content here."
          }
        ]
      },
      %{
        "_type" => "block",
        "_key" => "3135635709d3",
        "style" => "h2",
        "markDefs" => [],
        "children" => [
          %{
            "_type" => "span",
            "_key" => "6227b317763e",
            "marks" => [],
            "text" => "Another heading"
          }
        ]
      },
      %{
        "_type" => "block",
        "_key" => "16ad7ff860f2",
        "style" => "normal",
        "markDefs" => [],
        "children" => [
          %{
            "_type" => "span",
            "_key" => "bed2acdf1244",
            "marks" => [],
            "text" => "Another line, this time a blockquote. Maybe a link or two."
          }
        ]
      },
      %{
        "_type" => "block",
        "_key" => "a1b7fde2cd38",
        "style" => "normal",
        "markDefs" => [],
        "children" => [
          %{
            "_type" => "span",
            "_key" => "923b78bf4abe",
            "marks" => [],
            "text" => ""
          }
        ]
      },
      %{
        "_type" => "block",
        "_key" => "5ea211472b6f",
        "style" => "h3",
        "markDefs" => [],
        "children" => [
          %{
            "_type" => "span",
            "_key" => "4c8e01512357",
            "marks" => [],
            "text" => "And another heading"
          }
        ]
      },
      %{
        "_type" => "block",
        "_key" => "cedf3bb66b84",
        "style" => "normal",
        "markDefs" => [],
        "children" => [
          %{
            "_type" => "span",
            "_key" => "5d19aa101a49",
            "marks" => [],
            "text" => "One more final line."
          }
        ]
      }
    ]
  end

  def headings() do
    [
      %{
        "_key" => "81ebbf39b332",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "0459e5e00fc1",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 1"
          }
        ],
        "markDefs" => [],
        "style" => "h1"
      },
      %{
        "_key" => "53d275fbb268",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "99021f0fab04",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 2"
          }
        ],
        "markDefs" => [],
        "style" => "h2"
      },
      %{
        "_key" => "ce008c13f24d",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "ddcbd17465a2",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 3"
          }
        ],
        "markDefs" => [],
        "style" => "h3"
      },
      %{
        "_key" => "083e9e538995",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "64f5740ae068",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 4"
          }
        ],
        "markDefs" => [],
        "style" => "h4"
      },
      %{
        "_key" => "ce96ed413470",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "740dafaaf8a8",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 2"
          }
        ],
        "markDefs" => [],
        "style" => "h2"
      },
      %{
        "_key" => "8474017212a9",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "ed4aa2a251a3",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 3"
          }
        ],
        "markDefs" => [],
        "style" => "h3"
      },
      %{
        "_key" => "7825c76daa60",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "53f46d213e1a",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 3"
          }
        ],
        "markDefs" => [],
        "style" => "h3"
      },
      %{
        "_key" => "7ea9d8a61d32",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "e33bb3239f32",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 1"
          }
        ],
        "markDefs" => [],
        "style" => "h1"
      },
      %{
        "_key" => "dd9c233b3339",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "65f291019c42",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 5"
          }
        ],
        "markDefs" => [],
        "style" => "h5"
      },
      %{
        "_key" => "c57de3c19b12",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "5e60e4a171d6",
            "_type" => "span",
            "marks" => [],
            "text" => "Heading 6"
          }
        ],
        "markDefs" => [],
        "style" => "h6"
      },
      %{
        "_key" => "a43be4cf59a7",
        "_type" => "block",
        "children" => [
          %{
            "_key" => "f98cc8be8be0",
            "_type" => "span",
            "marks" => [],
            "text" => ""
          }
        ],
        "markDefs" => [],
        "style" => "normal"
      }
    ]
  end
end
