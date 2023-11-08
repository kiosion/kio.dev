defmodule PtTest do
  use ExUnit.Case, async: false

  alias Hexerei.PT

  test "Constructs heading tree given mixed content" do
    result = PT.build_summary(TestFixtures.mixed_headings())

    assert [
             %{
               parent: nil,
               type: "h2",
               text: "Another heading",
               key: "3135635709d3",
               children: [
                 %{
                   parent: "3135635709d3",
                   type: "h3",
                   text: "And another heading",
                   key: "5ea211472b6f",
                   children: [],
                   typeLevel: 3
                 }
               ],
               typeLevel: 2
             }
           ] = result
  end

  test "Constructs heading tree with proper nesting" do
    result = PT.build_summary(TestFixtures.headings())

    assert [
             %{
               parent: nil,
               type: "h1",
               text: "Heading 1",
               key: "81ebbf39b332",
               children: [
                 %{
                   parent: "81ebbf39b332",
                   type: "h2",
                   text: "Heading 2",
                   key: "53d275fbb268",
                   children: [
                     %{
                       parent: "53d275fbb268",
                       type: "h3",
                       text: "Heading 3",
                       key: "ce008c13f24d",
                       children: [
                         %{
                           parent: "ce008c13f24d",
                           type: "h4",
                           text: "Heading 4",
                           key: "083e9e538995",
                           children: [],
                           typeLevel: 4
                         }
                       ],
                       typeLevel: 3
                     }
                   ],
                   typeLevel: 2
                 },
                 %{
                   parent: "81ebbf39b332",
                   type: "h2",
                   text: "Heading 2",
                   key: "ce96ed413470",
                   children: [
                     %{
                       parent: "ce96ed413470",
                       type: "h3",
                       text: "Heading 3",
                       key: "8474017212a9",
                       children: [],
                       typeLevel: 3
                     },
                     %{
                       parent: "ce96ed413470",
                       type: "h3",
                       text: "Heading 3",
                       key: "7825c76daa60",
                       children: [],
                       typeLevel: 3
                     }
                   ],
                   typeLevel: 2
                 }
               ],
               typeLevel: 1
             },
             %{
               parent: nil,
               type: "h1",
               text: "Heading 1",
               key: "7ea9d8a61d32",
               children: [
                 %{
                   parent: "7ea9d8a61d32",
                   type: "h5",
                   text: "Heading 5",
                   key: "dd9c233b3339",
                   children: [
                     %{
                       parent: "dd9c233b3339",
                       type: "h6",
                       text: "Heading 6",
                       key: "c57de3c19b12",
                       children: [],
                       typeLevel: 6
                     }
                   ],
                   typeLevel: 5
                 }
               ],
               typeLevel: 1
             }
           ] = result
  end
end
