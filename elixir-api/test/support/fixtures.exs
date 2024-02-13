defmodule TestFixtures do
  def stub_config() do
    %{
      "query" => "*[!(_id in path('drafts.**')) && _type == 'siteSettings'][0]",
      "result" => %{
        "_type" => "siteSettings",
        "pgpKey" => "asdf",
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
        "about" => [
          %{
            "_key" => "7bf4a5a6e242",
            "content" => [
              %{
                "_key" => "1ac1d57afd3d",
                "_type" => "block",
                "children" => [
                  %{
                    "_key" => "6dcf3bf9552f",
                    "_type" => "span",
                    "marks" => [],
                    "text" =>
                      "Hey, I'm Maxim! I build stuff for the web. This is a fake fixture bio, but it's still pretty cool."
                  }
                ],
                "markDefs" => [],
                "style" => "normal"
              }
            ],
            "title" => "About me"
          }
        ],
        "meta" => [
          %{
            "_key" => "718d6c28e1ed",
            "content" => [
              %{
                "_key" => "0d0fbf3a3fb3",
                "_type" => "block",
                "children" => [
                  %{
                    "_key" => "cbec24f6f6f8",
                    "_type" => "span",
                    "marks" => [],
                    "text" => "Some fake content."
                  }
                ],
                "markDefs" => [],
                "style" => "normal"
              }
            ],
            "title" => "Say hello"
          },
          %{
            "_key" => "55a62fa15371",
            "content" => [
              %{
                "_key" => "741fb9aaed70",
                "_type" => "block",
                "children" => [
                  %{
                    "_key" => "5c6c2d43c0c80",
                    "_type" => "span",
                    "marks" => [],
                    "text" => "Want to send a secure message my way? Here's my main PGP key: "
                  },
                  %{
                    "_key" => "5c6c2d43c0c81",
                    "_type" => "span",
                    "marks" => [
                      "0a266b7fb48c",
                      "notranslate"
                    ],
                    "text" => "D1FD DE24 BB72 BFEF E045 ECE0 8A2C 67E2 2184 F162"
                  }
                ],
                "markDefs" => [
                  %{
                    "_key" => "0a266b7fb48c",
                    "_type" => "link",
                    "external" => false,
                    "href" => "/pgp.txt",
                    "newtab" => true
                  }
                ],
                "style" => "normal"
              }
            ],
            "title" => "PGP"
          },
          %{
            "_key" => "a6744f236518",
            "content" => [
              %{
                "_key" => "c3b88c908f0a",
                "_type" => "block",
                "children" => [
                  %{
                    "_key" => "b17e06e9b0ba",
                    "_type" => "span",
                    "marks" => [],
                    "text" => "Some more content here. Pretty meta."
                  }
                ],
                "markDefs" => [],
                "style" => "normal"
              }
            ],
            "title" => "Meta"
          }
        ],
        "socialLinks" => [
          %{
            "internal" => false,
            "name" => "Twitter",
            "rel" => [
              "nofollow"
            ],
            "_key" => "4b554b2e37a2",
            "url" => "https://twitter.com/0xKI0"
          },
          %{
            "name" => "Github",
            "rel" => [
              "nofollow"
            ],
            "_key" => "d2d628660c92",
            "url" => "https://github.com/kiosion",
            "internal" => false
          }
        ],
        "_createdAt" => "2022-08-27T00:49:57Z"
      },
      "ms" => 1
    }
  end

  def stub_posts_count(opts \\ []) do
    %{
      "query" =>
        "{ 'total': count(*[!(_id in path('drafts.**')) && _type == 'post']{_id, 'objectID':_id, _rev, _type, title, publishedAt, tags[]->{_id, title, slug}, slug, body, desc, date, 'numberOfCharacters':length(pt::text(body)), 'estimatedWordCount':round(length(pt::text(body)) / 5), 'estimatedReadingTime':round(length(pt::text(body)) / 5 / 120)}), 'count': count(*[!(_id in path('drafts.**')) && _type == 'post']{_id, 'objectID':_id, _rev, _type, title, publishedAt, 'author':{'_id':author->_id, '_type':author->_type, 'name':author->name, 'slug':author->slug, 'image':author->image}, tags[]->{_id, title, slug}, slug, body, desc, date, 'numberOfCharacters':length(pt::text(body)), 'estimatedWordCount':round(length(pt::text(body)) / 5), 'estimatedReadingTime':round(length(pt::text(body)) / 5 / 120)} | order(date desc) [0...10])}",
      "result" => %{
        "total" => opts[:total] || 1,
        "count" => opts[:count] || 1
      },
      "ms" => 1
    }
  end

  def stub_projects_count(opts \\ []) do
    %{
      "query" =>
        "{ 'total': count(*[!(_id in path('drafts.**')) && _type == 'project']{_id, 'objectID':_id, _rev, _type, title, publishedAt, tags[]->{_id, title, slug}, slug, body, desc, date, 'numberOfCharacters':length(pt::text(body)), 'estimatedWordCount':round(length(pt::text(body)) / 5), 'estimatedReadingTime':round(length(pt::text(body)) / 5 / 120)}), 'count': count(*[!(_id in path('drafts.**')) && _type == 'project']{_id, 'objectID':_id, _rev, _type, title, publishedAt, 'author':{'_id':author->_id, '_type':author->_type, 'name':author->name, 'slug':author->slug, 'image':author->image}, tags[]->{_id, title, slug}, slug, body, desc, date, 'numberOfCharacters':length(pt::text(body)), 'estimatedWordCount':round(length(pt::text(body)) / 5), 'estimatedReadingTime':round(length(pt::text(body)) / 5 / 120)} | order(date desc) [0...10])}",
      "result" => %{
        "total" => opts[:total] || 1,
        "count" => opts[:count] || 1
      },
      "ms" => 1
    }
  end

  def stub_posts(fakeSlugs \\ ["some-post"]) do
    %{
      "query" =>
        "*[!(_id in path('drafts.**')) && _type == 'post']{_id, 'objectID':_id, _rev, _type, title, publishedAt, tags[]->{_id, title, slug}, slug, body, desc, date, 'numberOfCharacters':length(pt::text(body)), 'estimatedWordCount':round(length(pt::text(body)) / 5), 'estimatedReadingTime':round(length(pt::text(body)) / 5 / 120)} | order(date desc) [0...10]",
      "result" => fakeSlugs |> Enum.map(&stub_post/1) |> Enum.map(& &1["result"]),
      "ms" => 1
    }
  end

  def stub_post(fakeSlug \\ "some-post") do
    %{
      "query" =>
        "*[!(_id in path('drafts.**')) && _type == 'post' && slug.current == 'some-post'][0]",
      "result" => %{
        "estimatedWordCount" => 11,
        "_type" => "post",
        "tags" => nil,
        "slug" => %{
          "_type" => "slug",
          "current" => "#{fakeSlug}"
        },
        "date" => "2022-08-26",
        "numberOfCharacters" => 55,
        "_id" => "b0a22943-b747-42df-84cd-573503332428",
        "_rev" => "DFeMJDW0bXSE9MGpOVLqKO",
        "title" => "Some post",
        "views" => 99,
        "objectID" => "b0a22943-b747-42df-84cd-573503332428",
        "publishedAt" => nil,
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
    }
  end

  def stub_project(fakeSlug \\ "some-project") do
    %{
      "query" =>
        "*[!(_id in path('drafts.**')) && _type == 'project' && slug.current == 'some-project'][0]",
      "result" => %{
        "estimatedWordCount" => 11,
        "_type" => "project",
        "tags" => [
          %{
            "_id" => "1234",
            "_type" => "tag",
            "title" => "elixir",
            "slug" => %{
              "_type" => "slug",
              "current" => "#{fakeSlug}"
            }
          }
        ],
        "slug" => %{
          "_type" => "slug",
          "current" => "some-project"
        },
        "date" => "2022-08-26",
        "numberOfCharacters" => 55,
        "_id" => "b0a22943-b747-42df-84cd-642861114995",
        "_rev" => "DFeMJDW0bXSE9MGpOVLqKO",
        "title" => "Some project",
        "views" => 23,
        "objectID" => "b0a22943-b747-42df-84cd-642861114995",
        "publishedAt" => nil,
        "body" => [
          %{
            "markDefs" => [],
            "children" => [
              %{
                "text" => "This project now has actual body content! Revolutionary...",
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
        "images" => [
          %{
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
          }
        ],
        "desc" => "Something interesting",
        "estimatedReadingTime" => 0
      }
    }
  end

  def stub_projects(fakeSlugs \\ ["some-project"]) do
    %{
      "query" =>
        "*[!(_id in path('drafts.**')) && _type == 'project']{_id, 'objectID':_id, _rev, _type, title, publishedAt, tags[]->{_id, title, slug}, slug, body, desc, date, 'numberOfCharacters':length(pt::text(body)), 'estimatedWordCount':round(length(pt::text(body)) / 5), 'estimatedReadingTime':round(length(pt::text(body)) / 5 / 120)} | order(date desc) [0...10]",
      "result" => fakeSlugs |> Enum.map(&stub_project/1) |> Enum.map(& &1["result"]),
      "ms" => 1
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
